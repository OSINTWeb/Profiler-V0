import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { CheckSquare, FileText, FileSpreadsheet, FileJson, FileEdit } from "lucide-react";
import carboneSDK from "carbone-sdk-js";

interface PlatformData {
  module: string;
  pretty_name: string;
  query: string;
  category: {
    name: string;
    description: string;
  };
  spec_format: {
    registered?: { value: boolean };
    breach?: { value: boolean };
    name?: { value: string };
    picture_url?: { value: string };
    website?: { value: string };
    id?: { value: string };
    bio?: { value: string };
    creation_date?: { value: string };
    gender?: { value: string };
    last_seen?: { value: string };
    username?: { value: string };
    location?: { value: string };
    phone_number?: { value: string };
    birthday?: { value: string };
    language?: { value: string };
    age?: { value: number };
    platform_variables?: Array<{
      key: string;
      value: string;
    }>;
  }[];
  front_schemas?: {
    image?: string;
  }[];
}

interface ActionBarProps {
  data: PlatformData[];
  hidebutton: boolean;
  sethidebutton: (hidebutton: boolean) => void;
  setenableselect: (enableselect: boolean) => void;
  enableselect: boolean;
  resultCount: number;
}

type ExportType = "pdf" | "csv" | "docx" | "json";

export const ActionBar: React.FC<ActionBarProps> = ({
  data,
  hidebutton,
  sethidebutton,
  setenableselect,
  enableselect,
  resultCount,
}) => {
  const flattenData = (item: PlatformData) => {
    const baseFields = {
      Module: item.module,
      "Pretty Name": item.pretty_name,
      Query: item.query,
      Category: item.category?.name,
      "Category Description": item.category?.description,
    };

    const specFields = item.spec_format?.[0]
      ? {
          Registered: item.spec_format[0].registered?.value ? "Yes" : "No",
          Breached: item.spec_format[0].breach?.value ? "Yes" : "No",
          Name: item.spec_format[0].name?.value,
          Website: item.spec_format[0].website?.value,
          ID: item.spec_format[0].id?.value,
          Bio: item.spec_format[0].bio?.value,
          "Creation Date": item.spec_format[0].creation_date?.value,
          Gender: item.spec_format[0].gender?.value,
          "Last Seen": item.spec_format[0].last_seen?.value,
          Username: item.spec_format[0].username?.value,
          Location: item.spec_format[0].location?.value,
          "Phone Number": item.spec_format[0].phone_number?.value,
          Birthday: item.spec_format[0].birthday?.value,
          Language: item.spec_format[0].language?.value,
          Age: item.spec_format[0].age?.value,
          ...(item.spec_format[0].platform_variables?.reduce((acc, variable) => {
            acc[variable.key] = variable.value;
            return acc;
          }, {} as Record<string, string>) || {}),
        }
      : {};

    return { ...baseFields, ...specFields };
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();

      // Set up fonts and styling
      doc.setFont("helvetica", "normal");

      // Add title
      doc.setFontSize(24);
      doc.text("Platform Data Report", 105, 20, { align: "center" });

      // Add generation date
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });

      let yPos = 50;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;

      // Helper function to add image
      const addImage = async (imageUrl: string, y: number) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          return new Promise<number>((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event) {
              if (event.target?.result) {
                const imgData = event.target.result as string;
                // Add image with 40x40 dimensions
                const imgWidth = 40;
                const imgHeight = 40;
                const xPos = margin;
                doc.addImage(imgData, "JPEG", xPos, y, imgWidth, imgHeight);
                resolve(imgHeight + 5); // Return height + padding
              } else {
                resolve(0);
              }
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error loading image:", error);
          return 0;
        }
      };

      // Process each record
      for (const item of data) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        // Record header with background
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(item.pretty_name || "Unknown Platform", margin + 2, yPos + 7);
        yPos += 15;

        // Add profile image if available
        const imageUrl =
          item.spec_format?.[0]?.picture_url?.value || item.front_schemas?.[0]?.image;

        if (imageUrl) {
          const imageHeight = await addImage(imageUrl, yPos);
          yPos += imageHeight;
        }

        // Basic Information Section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Basic Information", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");

        const addField = (label: string, value: any) => {
          if (value !== undefined && value !== null) {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, margin, yPos);
            doc.setFont("helvetica", "normal");
            const valueStr = String(value);
            // Handle long text with word wrap
            const splitText = doc.splitTextToSize(valueStr, pageWidth - 2 * margin - 40);
            doc.text(splitText, margin + 40, yPos);
            yPos += splitText.length * 7;
          }
        };

        // Add basic fields
        addField("Module", item.module);
        addField("Query", item.query);
        addField("Category", item.category?.name);

        // Account Status Section
        if (item.spec_format?.[0]) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Account Status", margin, yPos);
          yPos += 7;

          const spec = item.spec_format[0];
          if (spec.registered?.value !== undefined) {
            addField("Registered", spec.registered.value ? "Yes" : "No");
          }
          if (spec.breach?.value !== undefined) {
            addField("Breached", spec.breach.value ? "Yes" : "No");
          }
        }

        // Personal Information Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const personalInfo = {
            Name: spec.name?.value,
            Username: spec.username?.value,
            ID: spec.id?.value,
            Bio: spec.bio?.value,
            Website: spec.website?.value,
            Location: spec.location?.value,
            "Phone Number": spec.phone_number?.value,
            Gender: spec.gender?.value,
            Age: spec.age?.value,
            Language: spec.language?.value,
          };

          const hasPersonalInfo = Object.values(personalInfo).some((v) => v !== undefined);

          if (hasPersonalInfo) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Personal Information", margin, yPos);
            yPos += 7;

            Object.entries(personalInfo).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Dates Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const dates = {
            "Creation Date": spec.creation_date?.value,
            "Last Seen": spec.last_seen?.value,
            Birthday: spec.birthday?.value,
          };

          const hasDates = Object.values(dates).some((v) => v !== undefined);

          if (hasDates) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Dates", margin, yPos);
            yPos += 7;

            Object.entries(dates).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Add separator
        yPos += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;
      }

      // Save the PDF
      doc.save("platform_data.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const exportToCSV = () => {
    try {
      // Get all possible keys from all records
      const allKeys = new Set<string>();
      data.forEach((item) => {
        const flattened = flattenData(item);
        Object.keys(flattened).forEach((key) => allKeys.add(key));
      });

      const headers = Array.from(allKeys);
      const csvRows = data.map((item) => {
        const flattened = flattenData(item);
        return headers.map((header) => {
          const value = flattened[header as keyof typeof flattened];
          // Handle values that might contain commas
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
        });
      });

      const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "platform_data.csv");
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const exportToDOCX = async () => {
    try {
      // Create sections array for the document
      const sections = [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Platform Data Report",
              heading: HeadingLevel.TITLE,
              spacing: { before: 240, after: 240 },
            }),
            new Paragraph({
              text: `Generated on ${new Date().toLocaleString()}`,
              heading: HeadingLevel.HEADING_4,
              spacing: { before: 240, after: 480 },
            }),
          ],
        },
      ];

      // Process each record
      data.forEach((item, index) => {
        const recordData = flattenData(item);
        const children = [];

        // Add record header
        children.push(
          new Paragraph({
            text: `Record ${index + 1}: ${recordData["Pretty Name"]}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          }),
          // Add basic info
          new Paragraph({
            text: "Basic Information",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Module: ", bold: true }),
              new TextRun(recordData["Module"] || "N/A"),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Query: ", bold: true }),
              new TextRun(recordData["Query"] || "N/A"),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Category: ", bold: true }),
              new TextRun(recordData["Category"] || "N/A"),
            ],
            spacing: { after: 240 },
          })
        );

        // Add account status if available
        if (recordData["Registered"] || recordData["Breached"]) {
          children.push(
            new Paragraph({
              text: "Account Status",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
            })
          );

          if (recordData["Registered"]) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Registered: ", bold: true }),
                  new TextRun(recordData["Registered"]),
                ],
                spacing: { after: 120 },
              })
            );
          }

          if (recordData["Breached"]) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Breached: ", bold: true }),
                  new TextRun(recordData["Breached"]),
                ],
                spacing: { after: 120 },
              })
            );
          }
        }

        // Add personal information
        const personalInfo = {
          Name: recordData["Name"],
          Username: recordData["Username"],
          ID: recordData["ID"],
          Bio: recordData["Bio"],
          Website: recordData["Website"],
          Location: recordData["Location"],
          "Phone Number": recordData["Phone Number"],
          Gender: recordData["Gender"],
          Age: recordData["Age"],
          Language: recordData["Language"],
        };

        const hasPersonalInfo = Object.values(personalInfo).some((value) => value);

        if (hasPersonalInfo) {
          children.push(
            new Paragraph({
              text: "Personal Information",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
            })
          );

          Object.entries(personalInfo).forEach(([key, value]) => {
            if (value) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `${key}: `, bold: true }),
                    new TextRun(`${value}`),
                  ],
                  spacing: { after: 120 },
                })
              );
            }
          });
        }

        // Add dates if available
        const dates = {
          "Creation Date": recordData["Creation Date"],
          "Last Seen": recordData["Last Seen"],
          Birthday: recordData["Birthday"],
        };

        const hasDates = Object.values(dates).some((value) => value);

        if (hasDates) {
          children.push(
            new Paragraph({
              text: "Dates",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
            })
          );

          Object.entries(dates).forEach(([key, value]) => {
            if (value) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `${key}: `, bold: true }),
                    new TextRun(`${value}`),
                  ],
                  spacing: { after: 120 },
                })
              );
            }
          });
        }

        // Add separator
        children.push(
          new Paragraph({
            text: "",
            spacing: { after: 480 },
            border: {
              bottom: { style: "single", size: 6, color: "999999" },
            },
          })
        );

        // Add the section with all children
        sections.push({
          properties: {},
          children,
        });
      });

      // Create the document with all sections
      const doc = new Document({
        sections,
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "platform_data.docx");
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };

  const exportToJSON = () => {
    try {
      const exportData = data;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "platform_data.json");
    } catch (error) {
      console.error("Error generating JSON:", error);
    }
  };

  const handleExport = (type: ExportType) => {
    switch (type) {
      case "pdf":
        exportToPDF();
        break;
      case "csv":
        exportToCSV();
        break;
      case "docx":
        exportToDOCX();
        break;
      case "json":
        exportToJSON();
        break;
    }
  };

  return (
    <div className="flex w-full max-w-full items-stretch gap-5 font-medium text-center flex-wrap justify-between  px-2 max-md:max-w-full my-10 ">
      <div className="bg-gradient-to-br from-[#0f0f12] to-[#14141f] border flex w-full items-stretch gap-5 text-xl text-[rgba(84,143,155,1)] font-medium text-center leading-none flex-wrap justify-between px-[35px] py-[34px] rounded-lg border-[rgba(51,53,54,1)] border-solid max-md:max-w-full max-md:mr-2.5 max-md:px-5">
        <div className="flex  gap-[9px] items-center justify-center ">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e03434cdb0512efa4dac167482ef1507f4ba547658fc4e584099d26d4362fd4a?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[22px] shrink-0"
            alt="Results icon"
          />
          <div>{resultCount} Results</div>
        </div>
        <div className="flex items-stretch gap-[13px] text-sm text-[rgba(207,207,207,1)] whitespace-nowrap leading-loose h-10 overflow-x-auto scrollbar-hide ">
          {/* <button
            className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center ${
              hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
            }`}
            aria-label="Export PDF"
            onClick={() => handleExport("pdf")}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button> */}

          <button
            className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center ${
              hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
            }`}
            aria-label="Export CSV"
            onClick={() => handleExport("csv")}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button
            className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center ${
              hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
            }`}
            aria-label="Export DOC"
            onClick={() => handleExport("docx")}
          >
            <FileEdit className="w-4 h-4" />
            <span>DOC</span>
          </button>

          <button
            className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center ${
              hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
            }`}
            aria-label="Export JSON"
            onClick={() => handleExport("json")}
          >
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </button>
        </div>
      </div>
      {/* 
      <div className="flex items-stretch gap-[13px] text-xl text-white leading-none">
        <button
          className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] ${
            enableselect
              ? "border-teal-300 bg-transparent shadow-lg shadow-[rgba(84,143,155,0.5)]"
              : ""
          }`}
          aria-label="Select"
          onClick={() => setenableselect(!enableselect)}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Select</span>
        </button>
      </div> */}
    </div>
  );
};

export default ActionBar;
