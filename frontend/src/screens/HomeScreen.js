import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, Alert } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import BookItem from "../components/BookItem";
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("todos");

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas salir?", [
      { text: "Cancelar" },
      {
        text: "Sí",
        onPress: async () => {
          await signOut(auth);
          navigation.replace("Login");
        },
      },
    ]);
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(collection(db, "books"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(data);
    });

    return unsubscribe; // Detener escucha cuando se desmonta
  }, []);

  // 🔧 AQUI está la corrección que faltaba
  const filteredBooks = books.filter((book) => {
    if (filterStatus === "todos") return true;
    return book.status === filterStatus;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus libros</Text>

      <Text style={styles.label}>Filtrar por estado:</Text>
      <Picker
        selectedValue={filterStatus}
        onValueChange={(value) => setFilterStatus(value)}
        style={styles.picker}
      >
        <Picker.Item label="Todos" value="todos" />
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
          />
        )}
        ListEmptyComponent={<Text>No hay libros registrados aún.</Text>}
        style={{ marginBottom: 20 }}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Agregar nuevo libro"
          onPress={() => navigation.navigate("AddBook")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cerrar sesión" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  picker: {
    marginBottom: 16,
  },
});
