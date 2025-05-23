import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const API_URL = 'http://192.168.0.17:3000/api';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [loading, setLoading] = useState(true);

  const getBooks = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      Alert.alert("Error", "No se pudo cargar los libros");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  useEffect(() => {
    getBooks();
  }, []);

  const filteredBooks =
    filterStatus === "todos"
      ? books
      : books.filter((book) => book.status === filterStatus);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Libros</Text>

      <Text style={styles.label}>Filtrar por estado:</Text>
      <Picker
        selectedValue={filterStatus}
        onValueChange={setFilterStatus}
        style={styles.picker}
      >
        <Picker.Item label="Todos" value="todos" />
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>{item.author}</Text>
              <Text>Estado: {item.status}</Text>
            </View>
          )}
        />
      )}

      <Button title="Agregar libro" onPress={() => navigation.navigate("AddBook")} />
      <View style={{ marginTop: 10 }}>
        <Button title="Cerrar sesión" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "bold", marginBottom: 6 },
  picker: { marginBottom: 16 },
  bookItem: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 10
  },
  bookTitle: { fontWeight: "bold" }
});
