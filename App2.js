import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView,TouchableHighlight, TouchableWithoutFeedback, Pressable, Alert } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";
const MODE = "@mode";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [edit, setEdit] = useState();

  useEffect(() => {
    getMode();
    loadToDos();
  }, []);

  const travel = () => {
    setWorking(false);
    saveMode(false);
  };
  const work = () => {
    setWorking(true);
    saveMode(true);
  };

  const saveMode = async (working) => {
    await AsyncStorage.setItem(MODE, working.toString());
  }

  const getMode = async () => {
    const s = await AsyncStorage.getItem(MODE);
    setWorking(JSON.parse(s));
  }

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    // console.log(s);
    s !== null ? setToDos(JSON.parse(s)) : setToDos(true);
  }

  const addToDo = async () => {
    if(text === "") {
      return;
    }

    // const newToDos = Object.assign(
    //   {}, 
    //   toDos,
    //   { [Date.now()]: {text, work: working } },
    // );
    const newToDos = {
      ...toDos, 
      [Date.now()]: { text, working, done: false }
    };

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  // console.log(toDos);
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  const completeToDo = (key) => {
    const newToDos = { ...toDos };

    newToDos[key] = {
      text: newToDos[key].text,
      working: newToDos[key].working,
      done: newToDos[key].done ? false : true,
    }

    setToDos(newToDos);
    saveToDos(newToDos);
  }

  const editText = (key) => {
    console.log(key);
    
    setEdit(key);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        returnKeyType="done"
        value={text}
        placeholder={working ? "Add a To Do." : "Where do you want to go?"} 
        style={styles.input}
      />

      <ScrollView>
        {
          Object.keys(toDos).map((key) => 
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                  {
                    edit !== key ?
                    <>
                      <View style={styles.functions}>
                        <TouchableOpacity onPress={() => completeToDo(key)} style={styles.checkbox}>
                          <MaterialCommunityIcons name={!toDos[key].done ? "checkbox-blank-outline" : "checkbox-marked-outline" }  size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={ !toDos[key].done ? styles.toDoTextFalse : styles.toDoTextTrue }>{toDos[key].text}</Text>
                      </View>
                      <View style={styles.functions}>
                        <TouchableOpacity onPress={() => editText(key)}>
                          <Feather name="edit" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteToDo(key)} style={styles.deleteBtn}>
                          <Fontisto name="trash" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </> :
                    <>
                      <TextInput
                        // onSubmitEditing={addToDo}
                        // onChangeText={onChangeText}
                        returnKeyType="done"
                        // value="테스트"
                        style={styles.editInput}
                      />
                      <View style={styles.functions}>
                        <TouchableOpacity onPress={() => deleteToDo(key)} style={styles.deleteBtn}>
                          <AntDesign name="closecircle" size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                    </> 
                  }

          
              </View> 
            ) : null
          )
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    // color: "white" ,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoTextFalse: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toDoTextTrue: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through"
  },
  functions: {
    // width: ",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  deleteBtn: {
    marginLeft: 14
  },
  editInput: {
    width: "80%",
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 5,
    // marginVertical: 20,
    fontSize: 14,
  }
});
