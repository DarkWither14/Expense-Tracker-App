import React, { useState, useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";
import { LocaleContext } from "../contexts/LocaleContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./DataManager.css";

const DataManager = () => {
  const { transactions, importTransactions } = useContext(TransactionContext);
  const { t } = useContext(LocaleContext);
  const [importError, setImportError] = useState("");

  const exportToJSON = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = "transactions.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    const headers = ["Type", "Description", "Amount", "Date"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) => [
        t.type,
        t.description,
        t.amount,
        new Date(t.date).toLocaleDateString(),
      ].join(",")),
    ].join("\n");

    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    const exportFileDefaultName = "transactions.csv";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction History", 14, 15);

    const tableColumn = ["Type", "Description", "Amount", "Date"];
    const tableRows = transactions.map((t) => [
      t.type,
      t.description,
      t.amount,
      new Date(t.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [156, 39, 176],
        textColor: 255,
      },
    });

    doc.save("transactions.pdf");
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          importTransactions(data);
          setImportError("");
        } else {
          setImportError("Invalid data format");
        }
      } catch (error) {
        setImportError("Error importing file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-manager">
      <h2>{t('dataManagement')}</h2>
      <div className="data-actions">
        <button onClick={exportToJSON}>{t('exportJSON')}</button>
        <button onClick={exportToCSV}>{t('exportCSV')}</button>
        <button onClick={exportToPDF}>{t('exportPDF')}</button>
        <div className="import-section">
          <label htmlFor="import-file" className="import-label">
            {t('importJSON')}
          </label>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="import-input"
          />
        </div>
      </div>
      {importError && <div className="error-message">{importError}</div>}
    </div>
  );
};

export default DataManager; 