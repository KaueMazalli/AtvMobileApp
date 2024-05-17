import * as React from 'react'; 
import { View, StyleSheet, Text} from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import Pedidos from '../components/productsmanager';
import Clientes from './clientesmanager';
 
function HomeScreen() { 
    return ( 
        <View style={styles.container}> 
            <Text style={styles.title}>Bem-vindo à Página Inicial</Text>
            <Icon name="home" size={50} color="#4682B4" />
        </View> 
    ); 
} 
 
function ListScreen() { 
    return <Clientes/>
} 
 
function ProdutosScreen() { 
    return  <Pedidos/>
 
} 
 
function NotificationsScreen() { 
    return ( 
        <View style={styles.container}> 
            <Text></Text> 
        </View> 
    ); 
} 
 
const Tab = createBottomTabNavigator(); 
 
export default function MenuTabs() { 
    return ( 
        <NavigationContainer> 
            <Tab.Navigator 
                screenOptions={({ route }) => ({ 
                    tabBarIcon: ({ color, size }) => { 
                        let iconName; 
 
                        switch (route.name) { 
                            case 'Home': 
                                iconName = 'home'; 
                                break; 
                            case 'Listar': 
                                iconName = 'list'; 
                                break; 
                            case 'Smartphones': 
                                iconName = 'phone'; 
                                break; 
                            case 'Ler API': 
                                iconName = 'bell'; 
                                break; 
                            default: 
                                iconName = 'add-circle-outline'; 
                                break; 
                        } 
 
                        return <Icon name={iconName} size={size} color={color} />; 
                    }, 
                })} 
                tabBarOptions={{ 
                    activeTintColor: '#4682B4', 
                    inactiveTintColor: '#777', 
                    showLabel: true, 
                }} 
            > 
                <Tab.Screen name="Home" component={HomeScreen} /> 
                <Tab.Screen name="Clientes" component={ListScreen} /> 
                <Tab.Screen 
                    name="Smartphones" 
                    component={ProdutosScreen} 
                /> 
                <Tab.Screen name="Ler API" component={NotificationsScreen} /> 
                </Tab.Navigator> 
        </NavigationContainer> 
    ); 
} 
 
const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }, 
    title: {
        fontSize: 24,
        marginBottom: 20,
    }, 
    iconTabRound: { 
        width: 60, 
        height: 90, 
        borderRadius: 30, 
        marginBottom: 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        elevation: 6, 
        shadowColor: '#9C27B0', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 5, 
    } 
}); 