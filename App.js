import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function App() {
  const [baralho, setBaralho] = useState([]);
  const [carta, setCarta] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const puxarCarta = async () => {
    setCarregando(true); 
    let deck = baralho;
    if (deck.length === 0) {
      try {
        const resposta = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        const dados = await resposta.json();
        deck = dados.data;
        setBaralho(deck); 
      } catch (error) {
        console.error("Erro ao buscar a API:", error);
      }
    }

    if (deck.length > 0) {
      const numeroSorteado = Math.floor(Math.random() * deck.length);
      setCarta(deck[numeroSorteado]); 
    }
    
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Puxe Sua Carta</Text>
      {carta ? (
        <View style={styles.areaCarta}>
          <Image 
            source={{ uri: carta.card_images[0].image_url }} 
            style={styles.imagem} 
          />
          <Text style={styles.nomeCarta}>{carta.name}</Text>
        </View>
      ) : (
        <View style={styles.areaCarta}>
          <Image 
            source={{ uri: "https://images.ygoprodeck.com/images/cards/back_high.jpg" }} 
            style={styles.imagem} 
          />
          <Text style={styles.nomeCarta}>Sua carta aparecerá aqui...</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.botao} 
        onPress={puxarCarta} 
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" /> 
        ) : (
          <Text style={styles.textoBotao}>Puxar do Deck</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  areaCarta: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagem: {
    width: 250,
    height: 360,
    resizeMode: 'contain',
  },
  nomeCarta: {
    color: 'white',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#4c4eaf',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  textoBotao: {
    color: '#aeb3f3',
    fontSize: 20,
    fontWeight: 'bold',
  }
});