import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Pressable,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
const STATUS_KEY = "@status";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    const [edit, setEdit] = useState();
    const [editText, setEditText] = useState("");
    // const [complete, setComplete] = useState(false);

    useEffect(() => {
        setStatus();
        loadToDos();
    }, []);

    const travel = () => {
        setWorking(false);
        saveStatus(false);
    };
    const work = () => {
        setWorking(true);
        saveStatus(true);
    };

    const setStatus = async () => {
        const s = await AsyncStorage.getItem(STATUS_KEY);
        const status = s === "true" ? true : false;
        setWorking(status);
    };

    const saveStatus = async (status) => {
        await AsyncStorage.setItem(STATUS_KEY, String(status));
    };

    const onChangeText = (payload) => {
        setText(payload);
    };

    const saveToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };

    // 1.  ios에서 잘 작동, 안드 X
    const loadToDos = async () => {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        if (s) {
            setToDos(JSON.parse(s));
        }
    };

    // 2. 안드로이드에서 문제가 생겨 수정된 코드
    // async function loadToDos() {
    //     try {
    //         const jsonPayload = await AsyncStorage.getItem(STORAGE_KEY);
    //         return jsonPayload != null
    //             ? setToDos(JSON.parse(jsonPayload))
    //             : null;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const addToDo = async () => {
        if (text === "") {
            return;
        }
        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working, complete: false },
        };
        // const newToDos = Object.assign({}, toDos, {
        //     [Date.now()]: { text, work: working },
        // });
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    const deleteToDo = async (key) => {
        Alert.alert("Delete To Do", "Are you sure?", [
            { text: "Cancle" },
            {
                text: "I`m Sure",
                style: "destructive",
                onPress: () => {
                    const newToDos = { ...toDos };
                    delete newToDos[key];
                    setToDos(newToDos);
                    saveToDos(newToDos);
                },
            },
        ]);
        return;
    };

    const editStatusToDo = (key) => {
        setEdit(key);
    };

    const saveEditToDo = async (key) => {
        const newToDos = { ...toDos };
        newToDos[key].text = editText;

        setToDos(newToDos);
        await saveToDos(newToDos);
        setEditText("");
        setEdit(null);
    };

    const checkToDo = async (key) => {
        const newToDos = { ...toDos };
        newToDos[key].complete = !newToDos[key].complete;

        setToDos(newToDos);
        await saveToDos(newToDos);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? "white" : theme.grey,
                        }}>
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    underlayColor={"red"}
                    activeOpacity={0.5}
                    onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: !working ? "white" : theme.grey,
                        }}>
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    onSubmitEditing={addToDo}
                    onChangeText={onChangeText}
                    returnKeyType="done"
                    value={text}
                    placeholder={
                        working ? "Add a To Do" : "Where do you want to go?"
                    }
                    style={styles.input}
                />
                <ScrollView>
                    {Object.keys(toDos).map((key) =>
                        toDos[key].working === working ? (
                            <View style={styles.toDo} key={key}>
                                {edit !== key ? (
                                    <>
                                        <View style={styles.checkboxText}>
                                            {toDos[key].complete ? (
                                                <>
                                                    <TouchableOpacity
                                                        style={styles.checkbox}
                                                        onPress={() => {
                                                            checkToDo(key);
                                                        }}>
                                                        <Fontisto
                                                            name="checkbox-active"
                                                            size={18}
                                                            color="white"
                                                        />
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={{
                                                            ...styles.toDoText,
                                                            textDecorationLine:
                                                                "line-through",
                                                        }}>
                                                        {toDos[key].text}
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <TouchableOpacity
                                                        style={styles.checkbox}
                                                        onPress={() => {
                                                            checkToDo(key);
                                                        }}>
                                                        <Fontisto
                                                            name="checkbox-passive"
                                                            size={18}
                                                            color="white"
                                                        />
                                                    </TouchableOpacity>
                                                    <Text
                                                        style={styles.toDoText}>
                                                        {toDos[key].text}
                                                    </Text>
                                                </>
                                            )}
                                        </View>

                                        <View style={styles.functions}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    editStatusToDo(key);
                                                }}>
                                                <Feather
                                                    name="edit"
                                                    size={18}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    deleteToDo(key);
                                                }}>
                                                <Fontisto
                                                    name="trash"
                                                    size={18}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <TextInput
                                            // onSubmitEditing={addToDo}
                                            onChangeText={setEditText}
                                            returnKeyType="done"
                                            // value="테스트"
                                            style={styles.editInput}
                                        />
                                        <View style={styles.functions}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    saveEditToDo(key)
                                                }
                                                style={styles.deleteBtn}>
                                                <Fontisto
                                                    name="save-1"
                                                    size={18}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        ) : null
                    )}
                </ScrollView>
            </View>
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
        color: "white",
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
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    functions: {
        width: "15%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    checkbox: {
        marginRight: 10,
    },
    deleteBtn: {
        marginLeft: 14,
    },
    editInput: {
        width: "80%",
        backgroundColor: "white",
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 5,
        // marginVertical: 20,
        fontSize: 14,
    },
    checkboxText: {
        flexDirection: "row",
    },
});
