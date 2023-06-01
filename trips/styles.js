import { StyleSheet } from "react-native";
import { colors } from "../../../res/colors";
import { wp } from "../../../res/constants";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subView: {
        paddingHorizontal: wp(4)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabWrapper: {
        padding: wp(1.5),
        width: wp(30),
        alignItems: 'center',
        borderRadius: wp(4)
    },
    mapWrapper: {
        borderRadius: wp(4),
        overflow: 'hidden'
    },
    map: {
        width: wp(85),
        height: wp(30),
        alignSelf: "center",
        borderRadius: wp(4),
    },
    itemWrapper: {
        borderColor: colors.border3,
        borderWidth: 1,
        padding: wp(4),
        borderRadius: wp(4),
        marginVertical: wp(2),
        width: wp(90),
        alignSelf: 'center'
    },
})