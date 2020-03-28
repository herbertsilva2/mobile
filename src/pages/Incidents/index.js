import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import logoImg from '../../assets/logo.png';

import styles from './styles';

import api from '../../services/api'

const Incidents = () => {

  const [ incidents, setIncidents ] = useState([]);
  const [ total, setTotal ] = useState(0);
  const [ page, setPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);

  const loadIncidents = async () => {

    if(loading) {
      console.log("Entrou raso", page);
      return;
    }

    setLoading(true);

    if(parseInt(total) > 0 && incidents.length === parseInt(total)) {
      return;
    }

    const response = await api.get('incidents', { params: { page }});

    setIncidents([... incidents, ... response.data]);
    setTotal(response.headers['x-total-count']);
    setTimeout(() => {
      setLoading(false);
    },170);
    setPage(page + 1);
  }

  useEffect(() => {
    loadIncidents();
  }, [])

  const navigation = useNavigation();

  const navigateToDetail = (incident) => {
    navigation.navigate('Detail', { incident });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos.</Text>
        </Text>
      </View>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia!</Text>

      <FlatList
        data={ incidents }
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={true}
        style={styles.incidentList}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.3}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentProperty}>{incident.name}</Text>
            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentProperty}>{incident.title}</Text>
            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentProperty}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default Incidents;