import { View, Text, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import SuperText from '../../../components/SuperText'
import { colors } from '../../../res/colors'
import { wp } from '../../../res/constants'
import Spacer from '../../../components/Spacer'
import { styles } from './styles'
import { images } from '../../../res/images'
import Input from '../../../components/Input'
import { ScrollView } from 'react-native-gesture-handler'
import Button from '../../../components/Button'
import { postTripAction } from '../../../redux/actions/postTripAction'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { vehicleListAction } from '../../../redux/actions/VehicleListAction'
import { colourListData, citiesData } from '../../../constants/data'
import { Image_Url } from '../../../constants/url'

const MyVehicles = (props) => {
    const dispatch = useDispatch()
    const userData = useSelector(selectUser);

    // console.log("----userData myvehicl----", userData)
    
    const [vehicleList, setVehicleList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingVehicle, setIsLoadingVehicle] = useState(false)

    useEffect(()=>{
        getVehicles()
    },[userData])

    const getVehicles = () =>{
        setIsLoadingVehicle(true)
        // console.log("----userToken getVehicles----")
        // console.log("----userToken----", userData.data?.token)
       try {
        const data ={
            token: userData?.data?.token
        }
        dispatch(vehicleListAction(data)).unwrap().then((result)=>{
            // console.log("----Vehicle list result 9009---", result?.data)
            setIsLoadingVehicle(false)
            setVehicleList(result?.data?.vehicle)
            // props.navigation.navigate("TripDetails")
        }).catch((error)=>{
            setIsLoadingVehicle(false)
            console.log("----Vehicle error---", error)
        })
        
    } catch (error) {
        console.log("----Vehicle catch error---", error)
        
    }
    }

    const addVehicle = () =>{
        // console.log("---data postTripData---", postTripData)
        props.navigation.navigate("AddVehicle")

    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' />
            <Header onPressLeft={() => props.navigation.goBack()} shadow leftIcon={images.leftArrow} label="Vehicles" />
            <ScrollView enableOnAndroid showsVerticalScrollIndicator={false}>
                <View style={{alignItems:"center"}}>
                <Spacer space={wp(2)} />
                {/* <Input leftIcon={images.location} label="Source" placeholder="City" /> */}
               
                <SuperText style={{ paddingHorizontal: wp(4), }} value="Add a vehicle" bold color={colors.black} size={wp(5)} />
                {isLoadingVehicle && (<View><ActivityIndicator/></View> )}
                {/* {!isLoadingVehicle && vehicleList?.length==0 ?((<View><Text style={{color:"red"}}>No vehicle found!</Text></View>) ): <></>} */}
                {vehicleList?.length >0 ?
                vehicleList?.map((item)=>{
                    return(
                    <View key={item.id} style={{ width:"90%", flexDirection:"row", marginTop: wp(4), borderWidth: 0.5, borderRadius:8, padding:8, borderColor:"#cacaca"}}>
                      <Image source={{uri: Image_Url+item?.vehicle_images[0]?.image_link}} style={{width: 75, height: 72}} />
                      <Spacer row={wp(2)} />
                      <View>
                        <SuperText
                          value={item.model}
                          semiBold
                          color={colors.black}
                          size={wp(4.5)}
                        />
                        <Spacer space={wp(1)} />
                        <SuperText
                          value={item.model}
                          bold
                          color={colors.gray}
                          size={wp(3.5)}
                        />
                        <Spacer space={wp(1)} />
                        <SuperText
                          value={item.color + ', ' + item.year}
                          bold
                          color={colors.gray}
                          size={wp(3.5)}
                        />
                      </View>
                    </View>
                    )
                })

                : <View style={{alignItems:"center"}}>
                    <Image source={images.emptyState} />
                    <Spacer space={wp(1)} />
                    <SuperText style={{ paddingHorizontal: wp(4), }} value="No vehicles" bold color={colors.black} size={wp(5)} />
                    <Spacer space={wp(0.5)} />
                    {/* <SuperText color={colors.gray} regular size={wp(3)} value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi imperdiet." /> */}

                </View>
                }

                <Spacer space={wp(2)} />
                </View>
                <Button loading={isLoading} label="Add Vehicle" onPress={() => addVehicle()} btnStyle={{ alignSelf: 'center', marginVertical: wp(4) }} />
            </ScrollView >
        </View >
    )
}

export default MyVehicles