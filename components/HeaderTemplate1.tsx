import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
  },
  contact: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.5,
  },
});

interface HeaderTemplate1Props {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function HeaderTemplate1({
  name = "Your Name",
  email = "your.email@example.com",
  phone = "(555) 123-4567",
  address = "Your City, State ZIP",
}: HeaderTemplate1Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.contact}>
        <Text>{email}</Text>
        <Text>{phone}</Text>
        <Text>{address}</Text>
      </View>
    </View>
  );
}


