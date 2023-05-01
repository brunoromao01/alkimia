import React from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Essencia from '../views/Essencia'
import RecipeProduced from '../views/RecipeProduced'
import Marca from '../views/Marca'
import Receita from '../views/Receita'

const Tabs = createBottomTabNavigator()

export default props => {

    return (
        <Tabs.Navigator {...props}
            initialRouteName={'RecipeProduced'}
            screenOptions={{
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarShowLabel: false,                
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    left: 5,
                    backgroundColor: '#1B2040',
                    borderTopWidth: 0,
                    borderRadius: 15,
                    height: Dimensions.get('window').height * 0.1 ,
                    alignSelf:'center',
                    marginHorizontal: Dimensions.get('window').width * 0.1,
                },
            }}>
            <Tabs.Screen
                name='Essencia'
                component={Essencia}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        focused ? <Image style={styles.imageIcon} source={require('../assets/tabIcon/berries3.png')} />
                        : <Image style={styles.imageIcon2} source={require('../assets/tabIcon/berries3.png')} />
                    )
                }}
            />
            <Tabs.Screen
                name='Receita'
                component={Receita}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        focused ? <Image style={styles.imageIcon} source={require('../assets/tabIcon/essencia3.png')} />
                        : <Image style={styles.imageIcon2} source={require('../assets/tabIcon/essencia3.png')} />
                    )
                }}
            />
            <Tabs.Screen
                name='RecipeProduced'
                component={RecipeProduced}
                options={{
                    tabBarIcon: ({ focused, size, color }) => (
                        focused ? <Image style={styles.imageIcon} source={require('../assets/tabIcon/chart3.png')} />
                        : <Image style={styles.imageIcon2} source={require('../assets/tabIcon/chart3.png')} />
                    )
                }}
            />
        </Tabs.Navigator>
    )
}

const styles = StyleSheet.create({
    imageIcon: {
        width: 45,
        height: 45,
    },
    imageIcon2: {
        width: 35,
        height: 35,
    }
})