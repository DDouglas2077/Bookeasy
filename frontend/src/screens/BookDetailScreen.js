import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      const ref = doc(db, 'books', bookId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setAuthor(data.author);
        setStatus(data.status);
        setStartDate(data.startDate || '');
        setEndDate(data.endDate || '');
        setComment(data.comment || '');
      } else {
        Alert.alert('Error', 'Libro no encontrado');
        navigation.goBack();
      }
    };

    fetchBook();
  }, []);

  const handleUpdate = async () => {
    try {
      const ref = doc(db, 'books', bookId);
      await updateDoc(ref, {
        title,
        author,
        status,
        startDate,
        endDate,
        comment
      });
      Alert.alert('Libro actualizado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del libro</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título" />
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} placeholder="Autor" />
      
      <Text style={styles.label}>Estado:</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Fecha inicio" />
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="Fecha fin" />
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Comentario"
        multiline
      />

      <Button title="Guardar cambios" onPress={handleUpdate} />
      <Button
  title="Eliminar libro"
  onPress={() => {
    Alert.alert('¿Eliminar?', '¿Estás seguro de eliminar este libro?', [
      { text: 'Cancelar' },
      {
        text: 'Sí, eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'books', bookId));
            Alert.alert('Libro eliminado');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  }}
  color="red"
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  picker: {
    marginBottom: 16
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold'
  }
});
