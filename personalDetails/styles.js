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
    seats: {
        width: wp(10),
        height: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(5),
        borderWidth: 1,
        borderColor: colors.border,
        marginHorizontal: wp(2)
    },
    border: {
        backgroundColor: colors.border,
        height: 1,
        marginVertical: wp(4)
    },
    bg: {
        backgroundColor: colors.bg,
        borderRadius: wp(4),
        padding: wp(2)
    }
})