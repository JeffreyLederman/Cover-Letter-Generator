import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #2563eb",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e293b",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#64748b",
  },
  contactLeft: {
    flex: 1,
  },
  contactRight: {
    flex: 1,
    textAlign: "right",
  },
});

interface HeaderTemplate2Props {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function HeaderTemplate2({
  name = "Your Name",
  email = "your.email@example.com",
  phone = "(555) 123-4567",
  address = "Your City, State ZIP",
}: HeaderTemplate2Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.contactRow}>
        <View style={styles.contactLeft}>
          <Text>{email}</Text>
          <Text>{phone}</Text>
        </View>
        <View style={styles.contactRight}>
          <Text>{address}</Text>
        </View>
      </View>
    </View>
  );
}


