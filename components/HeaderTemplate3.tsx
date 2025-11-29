import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    borderLeft: "3 solid #e2e8f0",
    paddingLeft: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  contact: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.6,
    fontFamily: "Helvetica",
  },
});

interface HeaderTemplate3Props {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function HeaderTemplate3({
  name = "Your Name",
  email = "your.email@example.com",
  phone = "(555) 123-4567",
  address = "Your City, State ZIP",
}: HeaderTemplate3Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.contact}>
        <Text>{email} • {phone}</Text>
        <Text>{address}</Text>
      </View>
    </View>
  );
}


