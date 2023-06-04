import * as Notifications from "expo-notifications"

import { Alert, Button, Platform, StyleSheet, View } from "react-native"

import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    }
  }
})

const allowsNotificationsAsync = async () => {
  const settings = await Notifications.getPermissionsAsync()
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  )
}

const requestPermissionsAsync = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true
    }
  })
}

export default function App() {
  useEffect(() => {
    const configuredPushedNotification = async () => {
      const { status } = await Notifications.getPermissionsAsync()
      let finalStatus = status
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      console.log("finalStatus", finalStatus)

      if (finalStatus !== "granted") {
        Alert.alert(
          "Please give permission",
          "App needs to get the permission!"
        )
        return
      }

      const pushedNotification = await Notifications.getExpoPushTokenAsync()

      if (Platform.OS === "android") {
        Notifications.setNotificationCategoryAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT
        })
      }

      console.log(pushedNotification)
    }

    configuredPushedNotification()
  }, [])

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification Recived", notification)
        Alert.alert("He")
      }
    )

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log("Notification Responed Recived", notification)
      }
    )

    return () => {
      subscription1.remove()
      subscription2.remove()
    }
  }, [])

  async function scheduleNotificatioHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Sarrafi.App Title",
        body: "Sarrafi App Body Description",
        data: {
          userName: "mahdirasti"
        }
      },
      trigger: {
        seconds: 5
      }
    })
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={scheduleNotificatioHandler}
        title="Schedule Notification"
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})
