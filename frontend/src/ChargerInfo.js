import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

export default class ChargerInfo extends Component {
  state = {
    basicTabSelected: true,
  }

  selectBasicTab = () => {
    this.setState({ basicTabSelected: true });
  }

  selectAdvancedTab = () => {
    this.setState({ basicTabSelected: false });
  }

  render() {
    const { charger } = this.props;
    const {
      location, usageRestrictions, connection, operator, info,
    } = charger;
    const { basicTabSelected } = this.state;

    const details = basicTabSelected ? (
      <div key="basic">
        <h3>Location</h3>
        <DetailsSection>
          <LabeledValue label="Address" value={location.address} />
          <LabeledValue label="Email" value={location.contact.email} email />
          <LabeledValue label="Phone" value={location.contact.phone} />
          <LabeledValue label="URL" value={location.contact.website} url />
        </DetailsSection>
        <h3>Usage Restrictions</h3>
        <DetailsSection>
          <LabeledValue label="Access Key Required" value={usageRestrictions.accessKeyRequired} />
          <LabeledValue label="Membership Required" value={usageRestrictions.membershipRequired} />
          <LabeledValue label="Paid At Location" value={usageRestrictions.paidAtLocation} />
          <LabeledValue label="Comment" value={usageRestrictions.comment} />
        </DetailsSection>
        <h3>Connection</h3>
        <DetailsSection>
          <LabeledValue label="Connection Type" value={connection.type} />
          <LabeledValue label="Current Type" value={connection.currentType} />
          <LabeledValue label="Power" value={`${connection.power} kW`} />
        </DetailsSection>
      </div>
    ) : (
      <div key="advanced">
        <h3>Operator</h3>
        <DetailsSection>
          <LabeledValue label="Title" value={operator.title} />
          <LabeledValue label="URL" value={operator.website} url />
        </DetailsSection>
        <h3>Additional Information</h3>
        <DetailsSection>
          <LabeledValue label="Status" value={info.status} />
          <LabeledValue label="Comment" value={info.status} />
        </DetailsSection>
      </div>
    );

    return (
      <ChargerInfoContainer>
        <ChargerInfoHeader>
          <Tab selected={basicTabSelected} text="Basic" onClick={this.selectBasicTab} />
          <Tab selected={!basicTabSelected} text="Advanced" onClick={this.selectAdvancedTab} />
        </ChargerInfoHeader>

        <ChargerInfoDetails>
          <TransitionGroup>
            <CSSTransition key={basicTabSelected} className="slide" timeout={300} classNames="slide">
              { details }
            </CSSTransition>
          </TransitionGroup>
        </ChargerInfoDetails>
      </ChargerInfoContainer>
    );
  }
}

const Tab = ({ selected, text, onClick }) => (
  <TabContainer selected={selected} onClick={onClick}>
    { text }
  </TabContainer>
);

const TabContainer = styled.span`
  margin: 0 10px;
  font-size: 1.25rem;
  cursor: pointer;
  border-bottom: ${props => (props.selected ? '3px solid #3498db' : 'none')};
`;

const LabeledValue = ({
  label, value, url, email,
}) => {
  const displayedValue = (value === true && 'Yes') || (value === false && 'No') || value;
  if (!displayedValue) {
    return (null);
  }
  const displayedTag = (url || email) ? (
    <a href={email ? `mailto:${displayedValue}` : displayedValue}>
      { displayedValue }
    </a>
  ) : (
    <span>
      { displayedValue }
    </span>
  );
  return (
    <LabeledValueContainer>
      <small>
        { label }
      </small>
      { displayedTag }
    </LabeledValueContainer>
  );
};

const LabeledValueContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 5px;

  small {
    text-transform: uppercase;
    letter-spacing: 0.7;
    margin-left: 5px;
  }
`;

const DetailsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ChargerInfoContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #bdc3c7;
  border-top: none;

  transition: height 400ms linear;
`;

const ChargerInfoDetails = styled.div`
  position: relative;
  padding: 0 20px 20px 20px;
  h3 {
    margin-bottom: 5px;
  }
`;

const ChargerInfoHeader = styled.div`
  padding: 10px 0;

  display: flex;
  justify-content: center;

  font-size: 1.25rem;

  span {
    padding: 0 10px;
  }
`;
