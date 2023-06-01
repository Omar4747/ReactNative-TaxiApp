import { StyleSheet } from "react-native";
import { colors } from "../../../res/colors";
import { wp } from "../../../res/constants";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subView: {
        paddingHorizontal: wp(4),
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
    addPhoto: {
        backgroundColor: colors.blueLight,
        padding: wp(6),
        borderColor: colors.blueLightBorder,
        borderWidth: 1,
        borderStyle: "dotted",
        borderRadius: wp(4),
        alignItems: 'center',
        justifyContent: 'center'
    },
    luggage: {
        backgroundColor: colors.gray6,
        padding: wp(2),
        borderRadius: wp(4),
    },
    luggageWrapper: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: wp(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})