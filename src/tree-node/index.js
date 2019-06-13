import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { getDataset, isEmpty } from '../utils'
import Actions from './actions'
import NodeLabel from './node-label'
import Toggle from './toggle'

import styles from './index.css'

const cx = cn.bind(styles)

const isLeaf = children => isEmpty(children)

const getNodeCx = props => {
  const {
    keepTreeOnSearch,
    keepChildrenOnSearch,
    _children,
    matchInChildren,
    matchInParent,
    disabled,
    partial,
    hide,
    className,
    showPartiallySelected,
    readOnly,
    checked,
    _focused: focused,
  } = props

  return cx(
    'node',
    {
      leaf: isLeaf(_children),
      tree: !isLeaf(_children),
      disabled,
      hide,
      'match-in-children': keepTreeOnSearch && matchInChildren,
      'match-in-parent': keepTreeOnSearch && keepChildrenOnSearch && matchInParent,
      partial: showPartiallySelected && partial,
      readOnly,
      checked,
      focused,
    },
    className
  )
}

class TreeNode extends PureComponent {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    _depth: PropTypes.number,
    _children: PropTypes.array,
    actions: PropTypes.array,
    className: PropTypes.string,
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    partial: PropTypes.bool,
    dataset: PropTypes.object,
    keepTreeOnSearch: PropTypes.bool,
    keepChildrenOnSearch: PropTypes.bool,
    searchModeOn: PropTypes.bool,
    onNodeToggle: PropTypes.func,
    onAction: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    mode: PropTypes.oneOf(['multiSelect', 'simpleSelect', 'radioSelect', 'hierarchical']),
    showPartiallySelected: PropTypes.bool,
    readOnly: PropTypes.bool,
    clientId: PropTypes.string,
  }

  getAriaAttributes = () => {
    const { _children, _depth, checked, disabled, expanded, readOnly, mode, partial } = this.props
    const attributes = {}

    attributes.role = mode === 'simpleSelect' ? 'option' : 'treeitem'
    attributes['aria-disabled'] = disabled || readOnly
    attributes['aria-selected'] = checked
    if (mode !== 'simpleSelect') {
      attributes['aria-checked'] = partial ? 'mixed' : checked
      attributes['aria-level'] = (_depth || 0) + 1
      attributes['aria-expanded'] = _children && (expanded ? 'true' : 'false')
    }
    return attributes
  }

  render() {
    const {
      mode,
      keepTreeOnSearch,
      _id,
      _children,
      dataset,
      _depth,
      expanded,
      title,
      label,
      partial,
      checked,
      value,
      disabled,
      actions,
      onAction,
      searchModeOn,
      onNodeToggle,
      onCheckboxChange,
      showPartiallySelected,
      readOnly,
      clientId,
    } = this.props
    const liCx = getNodeCx(this.props)
    const style = keepTreeOnSearch || !searchModeOn ? { paddingLeft: `${(_depth || 0) * 20}px` } : {}

    const liId = `${_id}_li`

    return (
      <li className={liCx} style={style} id={liId} {...getDataset(dataset)} {...this.getAriaAttributes()}>
        <div className="customWrapper">
          <Toggle isLeaf={isLeaf(_children)} expanded={expanded} id={_id} onNodeToggle={onNodeToggle} />
          <NodeLabel
            title={title}
            label={label}
            id={_id}
            partial={partial}
            checked={checked}
            value={value}
            disabled={disabled}
            mode={mode}
            onCheckboxChange={onCheckboxChange}
            showPartiallySelected={showPartiallySelected}
            readOnly={readOnly}
            clientId={clientId}
          />
          <Actions actions={actions} onAction={onAction} id={_id} readOnly={readOnly} />
        </div>
      </li>
    )
  }
}

export default TreeNode
