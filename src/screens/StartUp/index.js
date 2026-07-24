import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colors } from '~/constants/theme'
import { useDispatch, useSelector } from 'react-redux'
import {
    setProvider,
} from '~/redux/profileSlice'
import AsyncStorage from '@react-native-community/async-storage'

const StartUp = ({ navigation }) => {
    const dispatch = useDispatch()
    const setDefaultProvider = async () => {
        try{
            await AsyncStorage.setItem('userProfile', JSON.stringify({
                myList: '',
                continueWatching: '',
                downloads: '',
                provider: 'vidking',
                open_subtitle: '',
                open_subtitle_token: '',
                player_type: 'legacy',
            })).then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Splash' }]
                })
            }).catch((error) => {
                alert("An error occurred while saving your data")
            });
        } catch (e) {
            alert(e)
        }
    }
        

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={require('~/assets/logo/logo.png')}
                style={{
                    width: 200,
                    marginBottom: 20,
                }}
            />
            <Text
                style={{
                    color: colors.white,
                    fontSize: 20,
                    textAlign: 'center',
                    paddingHorizontal: 20,
                }}
            >
                مرحباً بك في LATCHI PLAY {'\n\n'}
                أفلام ومسلسلات بدون حدود.
                مجاني تماماً، بدون إعلانات.
            </Text>
            <TouchableOpacity
                onPress={setDefaultProvider}
                style={{
                    backgroundColor: colors.red,
                    padding: 10,
                    marginTop: 20,
                    borderRadius: 10,
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        textAlign: 'center',
                    }}
                >
                    يلا نبدأ!
                </Text>
            </TouchableOpacity>
        </View>
    )
}



export default StartUp