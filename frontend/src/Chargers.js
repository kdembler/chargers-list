import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

export default class Chargers extends Component {
  state = {
    citiesInfo: null,
    loading: true,
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:5000/v1/cities');
      this.setState({ loading: false, citiesInfo: response.data.cities });
    } catch (error) {
      console.error(error);
    }
  }

  get status() {
    const { loading, citiesInfo } = this.state;
    if (loading) {
      return 'Loading...';
    }
    const chargersCount = Object.values(citiesInfo)
      .reduce((acc, city) => acc + city.chargers.length, 0);
    return `Fetched ${chargersCount} chargers`;
  }

  render() {
    return (
      <Container>
        <h1>Chargers</h1>
        <p>
          {this.status}
        </p>
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 100px 300px;
`;
