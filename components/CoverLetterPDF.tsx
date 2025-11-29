import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { HeaderTemplate1 } from "./HeaderTemplate1";
import { HeaderTemplate2 } from "./HeaderTemplate2";
import { HeaderTemplate3 } from "./HeaderTemplate3";
import { TemplateId } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    color: "#1e293b",
  },
  date: {
    marginBottom: 20,
    fontSize: 10,
    color: "#64748b",
  },
  recipient: {
    marginBottom: 20,
    fontSize: 10,
    color: "#1e293b",
  },
  greeting: {
    marginBottom: 12,
    fontSize: 11,
  },
  content: {
    marginBottom: 20,
    fontSize: 11,
    textAlign: "justify",
  },
  paragraph: {
    marginBottom: 12,
  },
  closing: {
    marginTop: 20,
    marginBottom: 8,
  },
  signature: {
    marginTop: 30,
  },
});

interface CoverLetterPDFProps {
  content: string;
  templateId: TemplateId;
  jobTitle: string;
  company: string;
  date?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function CoverLetterPDF({
  content,
  templateId,
  jobTitle,
  company,
  date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  name = "Your Name",
  email = "your.email@example.com",
  phone = "(555) 123-4567",
  address = "Your City, State ZIP",
}: CoverLetterPDFProps) {
  // Parse markdown content into paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const renderHeader = () => {
    switch (templateId) {
      case "classic":
        return (
          <HeaderTemplate1
            name={name}
            email={email}
            phone={phone}
            address={address}
          />
        );
      case "modern":
        return (
          <HeaderTemplate2
            name={name}
            email={email}
            phone={phone}
            address={address}
          />
        );
      case "minimal":
        return (
          <HeaderTemplate3
            name={name}
            email={email}
            phone={phone}
            address={address}
          />
        );
      default:
        return (
          <HeaderTemplate1
            name={name}
            email={email}
            phone={phone}
            address={address}
          />
        );
    }
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {renderHeader()}

        <Text style={styles.date}>{date}</Text>

        <View style={styles.recipient}>
          <Text>Hiring Manager</Text>
          <Text>{company}</Text>
        </View>

        <Text style={styles.greeting}>Dear Hiring Manager,</Text>

        <View style={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={styles.closing}>
          <Text>Sincerely,</Text>
        </View>

        <View style={styles.signature}>
          <Text>{name}</Text>
        </View>
      </Page>
    </Document>
  );
}


