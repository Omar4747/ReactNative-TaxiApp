import { View, Text, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, {useCallback, useState, useEffect} from 'react'
import Header from '../../../components/Header'
import SuperText from '../../../components/SuperText'
import { colors } from '../../../res/colors'
import { wp } from '../../../res/constants'
import Spacer from '../../../components/Spacer'
import { styles } from './styles'
import { images } from '../../../res/images'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, selectUser, setUserType, selectUserType } from '../../../redux/slices/userSlice'
import ToggleSwitch from 'toggle-switch-react-native'
import { Image_Url } from '../../../constants/url'
import { userTypeEnum } from '../../../constants/constants'
import { getProfileDataAction } from '../../../redux/actions/updateProfileAction'


function Items(props) {
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.row, { marginHorizontal: wp(4), paddingVertical: wp(5), }, !props.last && { borderBottomWidth: 1, borderColor: colors.border3 }]}>
            <SuperText value={props.label} color={colors.black} bold size={wp(4.5)} />
            <Image source={images.rightArrow} />
        </TouchableOpacity>
    );
}

const Account = (props) => {

    const dispatch = useDispatch()
    const userData = useSelector(selectUser);
    const userType = useSelector(selectUserType);
    const [toggle, setToggle] = useState(true)
    const [myData, setMyData] = useState("");
    // console.log("----usertype acccc---", userData)

    let {name, email, profile_image} = userData?.data?.user

    useEffect(()=>{

        // console.log("----usertype acccc---", userType)
        if(userType.type=== userTypeEnum.DRIVER){
            setToggle(1)
            
        }else{
            
            setToggle(0)
        }

    },[selectUserType])

    useEffect(()=>{

        try {
          const data = {
            token: userData?.data?.token,
            // user_type: userType.type.toLowerCase(),
          };
          dispatch(getProfileDataAction(data))
            .unwrap()
            .then(result => {
              setMyData(result.data)
              // console.log("------ result -----", result)
              // setLoading(false);
            })
            .catch(error => {
              // setLoading(false);
            });
          } catch (error) {
            console.log('---- trips catch error -----', error);
            
          }
    
      },[])


    const profileType = useCallback((isOn) =>{

        setToggle(isOn)
        
        if(isOn){
            dispatch(setUserType({type:"Driver"}))
            
        }else{
            dispatch(setUserType({type:"Passenger"}))

        }
        
    })


    const LogoutFtn = () =>{
        //clear redux 
        dispatch(setUser({}))
        //navigate reset
        props.navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }],
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' />
            <Header onPressLeft={() => props.navigation.goBack()} shadow leftIcon={images.leftArrow} label="Account" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.subView}>
                    <View style={styles.profileWrapper}>
                    {profile_image== null?
                        <Image source={images.profile} style={{height:60, width:60}} height={60} width={60}/>                :    
                    <Image source={{uri:Image_Url+profile_image}} style={{width: 65, height: 65, borderRadius: 90/2}} />
                }
                        <View style={{ width: wp(60) }}>
                            <SuperText color={colors.black} bold size={wp(5)} value={name} />
                            <SuperText color={colors.gray} semiBold size={wp(4)} value={email} />
                        </View>
                        <TouchableOpacity onPress={() => props.navigation.navigate("PersonalDetails",{data: {type:"visit"}})}>
                            <SuperText value="Edit" color={colors.primary} bold size={wp(4.5)} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Spacer space={wp(2)} />
                <View style={styles.subView}>
                    <View style={styles.profileWrapper}>
                        <View style={{flexDirection:"row"}}>
                            <SuperText value="Profile Type" color={colors.black} bold size={wp(4.5)} />
                            <View style={{ borderRadius:8, marginHorizontal:wp(2), padding:5, backgroundColor:toggle?colors.green2: colors.red}}>
                            <SuperText value={toggle? userTypeEnum.DRIVER: userTypeEnum.PASSENGER} color={colors.white} bold regular size={wp(4)} />
                            </View>
                            {/* {errorMsg?.form ? <View style={{marginLeft:20, marginTop:16}}><Text style={{color:'red'}}>{errorMsg?.form}</Text></View> : <></>} */}
                        </View>
                        <ToggleSwitch
                            isOn={toggle==1}
                            onColor={colors.green2}
                            offColor="red"
                            size="medium"
                            onToggle={isOn => profileType(isOn)}
                        />
                    </View>
                </View>
                <View style={styles.divier} />
                {/* <Items label="Profile Type" /> */}
                <Items onPress={() => props.navigation.navigate("PersonalDetails",{data: {type:"visit"}})} label="Profile settings" />
                <Items label="ID Verification" 
                 onPress={() => {
                    props.navigation.navigate('VerifyId', {verified: myData?.user?.verification_approve==0 || myData?.user?.verification_approve==null? false: true, imageUploaded: myData?.user?.verification_image })
                  }}
                 />
                <Items onPress={() => props.navigation.navigate("ChangePassword")} label="Change Password" />
                <Items onPress={() => props.navigation.navigate("EmailSetup")} label="Change Email" />
                {userType.type === userTypeEnum.DRIVER &&
                <Items onPress={() => props.navigation.navigate("MyVehicles")} label="My Vehicles" />}
                {/* <Items last label="Notifications" /> */}
                <View style={styles.divier} />
                {userType.type === userTypeEnum.PASSENGER &&
                <Items label="Passenger payments" />}
                {userType.type === userTypeEnum.DRIVER &&
                <Items last label="Driver payouts" />}
                <View style={styles.divier} />
                {/* <Items label="Help" /> */}
                {/* <Items last label="Cool stuff" /> */}
                <Items last label="Logout" onPress={() => {LogoutFtn()}} />
            </ScrollView>
        </View>
    )
}

export default Account