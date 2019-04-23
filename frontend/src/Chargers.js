import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import { Cell, ExpandableCell } from './Cells';
import ChargerInfo from './ChargerInfo';
import { ReactComponent as Spinner } from './assets/spinner.svg';

const unknownPowerGroupKey = 'unknown';
const powerGroups = {
  high: {
    text: 'More than 11 kW',
    min: 11,
    displayOrder: 3,
  },
  mid: {
    text: 'Less than 11 kW, more than 3.7 kW',
    min: 3.7,
    displayOrder: 2,
  },
  low: {
    text: 'Less than 3.7 kW',
    min: 0,
    displayOrder: 1,
  },
  [unknownPowerGroupKey]: {
    text: 'Unknown',
    displayOrder: 4,
  },
};

export default class Chargers extends Component {
  state = {
    citiesInfo: [],
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:5000/v1/cities');
      const rawCities = response.data.cities;
      const parsedCities = this.parseCities(rawCities);
      this.setState({ citiesInfo: parsedCities });
    } catch (error) {
      console.error(error);
    }
  }

  parseCities = cities => {
    const sortedPowerGroupsKeys = Object.keys(powerGroups)
      .filter(groupKey => groupKey !== unknownPowerGroupKey)
      .sort((a, b) => powerGroups[b].min - powerGroups[a].min);

    return Object.values(cities || {})
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map(city => {
        const { chargers } = city;

        const groupedChargers = chargers.reduce((acc, charger) => {
          const { power } = charger.connection;
          const group = (power && sortedPowerGroupsKeys
            .find(groupKey => powerGroups[groupKey].min < power))
          || unknownPowerGroupKey;
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(charger);
          return acc;
        }, {});

        return {
          name: city.displayName,
          groupedChargers,
        };
      });
  }

  render() {
    const { citiesInfo } = this.state;
    const citiesCells = citiesInfo
      .map(city => {
        const renderCityHeader = expanded => (
          <Cell lead expanded={expanded}>
            { city.name }
          </Cell>
        );

        const groupsCells = Object.keys(city.groupedChargers)
          .sort((a, b) => powerGroups[a].displayOrder - powerGroups[b].displayOrder)
          .map(groupKey => {
            const renderGroupHeader = expanded => (
              <Cell level={1} expanded={expanded}>
                { powerGroups[groupKey].text }
              </Cell>
            );

            const chargersCells = city.groupedChargers[groupKey].map(charger => {
              const renderChargerHeader = expanded => (
                <Cell level={2} expanded={expanded}>
                  { charger.location.title }
                </Cell>
              );
              return (
                <ExpandableCell key={charger.location.title} renderHeader={renderChargerHeader}>
                  <ChargerInfo charger={charger} />
                </ExpandableCell>
              );
            });

            return (
              <ExpandableCell key={groupKey} renderHeader={renderGroupHeader}>
                { chargersCells }
              </ExpandableCell>
            );
          });

        return (
          <ExpandableCell key={city.name} spaced renderHeader={renderCityHeader}>
            { groupsCells }
          </ExpandableCell>
        );
      });

    const isLoading = !citiesCells.length;
    const spinner = (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );

    return (
      <Container>
        <Header>
          <h1>Chargers</h1>
          <p>Pick the city and power group you're interested in</p>
        </Header>
        { isLoading ? spinner : citiesCells }
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 10px 0;

  @media screen and (min-width: 768px) {
    padding: 20px 100px 50px 100px;
  }

  @media screen and (min-width: 992px) {
    padding: 40px 200px;
  }

  @media screen and (min-width: 1200px) {
    padding: 40px 300px;
  }

  @media screen and (min-width: 1500px) {
    padding: 40px 400px;
  }
`;

const Header = styled.div`
  padding-left: 15px;
  margin-bottom: 10px;

  h1 {
    margin-bottom: 0;
  }

  p {
    margin-top: 0;
  }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
`;
