import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:3002/api/files")
            .then((response) => setFiles(response.data.files))
            .catch((error) => console.error("Error fetching files:", error));

        const eventSource = new EventSource(
            "http://localhost:3002/api/realtime"
        );
        
        eventSource.onmessage = (event) => {
            const updatedFiles = JSON.parse(event.data).files;
            setFiles(updatedFiles);
        };

        return () => eventSource.close();
    }, []);

    const handleFileClick = (file: React.SetStateAction<null>) => {
        setSelectedFile(file);
    };

    const handleToggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Left Sidebar */}
            <div
                style={{
                    width: isSidebarCollapsed ? "50px" : "200px",
                    border: "none",
                    color: "#999",
                    backgroundColor: "#343434",
                    overflowX: "hidden",
                    transition: "width 0.5s",
                }}
            >
                <button
                    onClick={handleToggleSidebar}
                    style={{ cursor: "pointer" }}
                >
                    Toggle Sidebar
                </button>
                <ul>
                    {files.map((file) => (
                        <li
                            key={file}
                            onClick={() => handleFileClick(file)}
                            style={{
                                cursor: "pointer",
                                color: selectedFile === file ? "#fff" : "#999",
                                borderRight:
                                    selectedFile === file
                                        ? "4px solid #64b5f6"
                                        : "none",
                                padding: "8px",
                                fontSize: "14px",
                                lineHeight: "24px",
                                transition: "color 0.3s",
                            }}
                            onMouseOver={(e) => {
                                selectedFile !== file &&
                                    ((e.target as HTMLLIElement).style.color =
                                        "#fff");
                            }}
                            onMouseOut={(e) => {
                                selectedFile !== file &&
                                    ((e.target as HTMLLIElement).style.color =
                                        "#999");
                            }}
                        >
                            {file}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main View */}
            <div style={{ flex: 1 }}>
                {selectedFile && (
                    <iframe
                        title="File View"
                        src={`http://localhost:3001/reports/${selectedFile}`}
                        style={{
                            width: "100%",
                            height: "100vh",
                            border: "none",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default FileList;
