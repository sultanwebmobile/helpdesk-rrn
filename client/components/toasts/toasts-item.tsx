import React, { PureComponent } from 'react';

interface IToastsItemProps {
  type: string;
  clickAction: () => void;
  initDeleteTimeout: () => number;
}

export default class ToastsItem extends PureComponent<IToastsItemProps> {
  private timerId: number;

  componentDidMount() {
    this.timerId = this.props.initDeleteTimeout();
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  getClassName() {
    const { type } = this.props;
    let className;

    switch (type) {
      case 'error': {
        className = 'toasts__element_error';
        break;
      }

      case 'warning': {
        className = 'toasts__element_warning';
        break;
      }

      default: {
        className = 'toasts__element_info';
      }
    }

    return `toasts__element ${className}`;
  }

  render() {
    const { clickAction } = this.props;

    return (
      <div className={this.getClassName()} onClick={clickAction}>
        {this.props.children}
      </div>
    );
  }
}
