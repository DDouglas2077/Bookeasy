import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('por leer');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [comment, setComment] = useState('');

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert('Campos obligatorios', 'Debes completar al menos título y autor.');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    try {
      await addDoc(collection(db, 'books'), {
        uid: auth.currentUser.uid,
        title,
        author,
        status,
        startDate: startDate || null,
        endDate: endDate || null,
        comment: comment || ''
      });

      Alert.alert('Libro agregado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el libro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Libro</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={styles.label}>Estado:</Text>
      <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
        <Picker.Item label="Por leer" value="por leer" />
        <Picker.Item label="Leyendo" value="leyendo" />
        <Picker.Item label="Completado" value="completado" />
      </Picker>

      <View>
        <Text style={styles.label}>Fecha de inicio:</Text>
        <Button
          title={startDate ? startDate.toDateString() : 'Seleccionar fecha de inicio'}
          onPress={() => setShowStartPicker(true)}
        />
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
      </View>

      <View>
        <Text style={styles.label}>Fecha de fin:</Text>
        <Button
          title={endDate ? endDate.toDateString() : 'Seleccionar fecha de fin'}
          onPress={() => setShowEndPicker(true)}
        />
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Comentario"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Button title="Guardar libro" onPress={handleAddBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  picker: {
    marginBottom: 16
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6
  }
});
