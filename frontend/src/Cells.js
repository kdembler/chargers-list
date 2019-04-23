import React, { Component } from 'react';
import styled from 'styled-components';

class ExpandableCell extends Component {
  state = {
    expanded: false,
  }

  trigger = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  render() {
    const { children, renderHeader, spaced } = this.props;
    const { expanded } = this.state;
    const header = renderHeader(expanded);
    return (
      <ExpandableCellContainer spaced={spaced}>
        <ExpandableCellHeader onClick={this.trigger} role="button" tabIndex="0">
          { header }
        </ExpandableCellHeader>
        { expanded && children }
      </ExpandableCellContainer>
    );
  }
}

const ExpandableCellContainer = styled.div`
  :not(:last-child) {
    margin-bottom: ${props => (props.spaced ? 5 : 0)}px;
    border-bottom: ${props => (props.spaced ? 'none' : '1px solid #bdc3c7')};
  }
`;

const ExpandableCellHeader = styled.div`
  cursor: pointer;
`;

const Cell = ({
  children, onClick, bold, accent, level,
}) => (
  <CellContainer onClick={onClick} bold={bold} accent={accent} level={level}>
    { children }
  </CellContainer>
);

const CellContainer = styled.div`
  display: flex;
  background-color: #fff;
  padding: 15px 10px;
  padding-left: ${props => 40 + 20 * (props.level || 0)}px;

  font-size: ${props => (props.bold ? '1.25' : '1')}rem;
  font-weight: ${props => (props.bold ? '500' : '300')};

  border-bottom: ${props => (props.accent ? '1px solid #bdc3c7' : 'none')};
`;

export { ExpandableCell, Cell };
