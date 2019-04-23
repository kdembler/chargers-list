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
  children, onClick, lead, level, expanded,
}) => (
  <CellContainer onClick={onClick} lead={lead} expanded={expanded} level={level}>
    <TriggerContainer expanded={expanded}>
      { expanded ? '—' : '+' }
    </TriggerContainer>
    { children }
  </CellContainer>
);

const CellContainer = styled.div`
  display: flex;
  background-color: #fff;
  padding: 15px 10px;
  padding-left: ${props => 20 + 10 * (props.level || 0)}px;
  @media screen and (min-width: 768px) {
    padding-left: ${props => 40 + 20 * (props.level || 0)}px;
  }

  font-size: ${props => (props.lead ? '1.25' : '1')}rem;
  font-weight: ${props => (props.lead ? '500' : '300')};

  border-bottom: ${props => (props.expanded ? '1px solid #bdc3c7' : 'none')};

  :hover {
    background-color: #e8eded;
  }
`;

const TriggerContainer = styled.div`
  color: ${props => (props.expanded ? '#d35400' : '#27ae60')};
  min-width: 30px;
  text-align: center;
  font-weight: 400;
`;

export { ExpandableCell, Cell };
