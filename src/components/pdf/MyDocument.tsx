import React from "react";
import { Document, Page, Text, StyleSheet, Font } from "@react-pdf/renderer";

// Font.register({
//   family: "Roboto",
//   src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf",
// });

Font.register({
  family: "Noto Sans KR",
  src: "https://fonts.gstatic.com/s/notosanskr/v15/Pby6FmXiEBPT4ITbgNA5CgmOsn7uwpYcuH8y.otf",
})

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  section: {
    fontSize: 12,
    fontFamily: "Noto Sans KR",
    marginBottom: 20,
    lineHeight: 1.5,
  },
});

interface MyDocumentProps {
  content: string;
}

const MyDocument: React.FC<MyDocumentProps> = ({ content }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.section}>{content}</Text>
    </Page>
  </Document>
);

export default MyDocument;
