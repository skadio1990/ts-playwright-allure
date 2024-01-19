interface FileData {
    data: {
        failed: number;
        broken: number;
        skipped: number;
        passed: number;
        unknown: number;
        total: number;
    };
}

const statusIndicator = (fileData: FileData[]) => {
    if (fileData.length === 0) {
        return null;
    }

    const successRate =
        (fileData[0].data.passed / fileData[0].data.total) * 100;

    const backgroundColor =
        successRate === 100
            ? "#97cc64"
            : `linear-gradient(to right, #fd5a3e ${
                  100 - successRate
              }%, #97cc64 ${successRate}%)`;

    return (
        <div
            style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: backgroundColor,
            }}
        ></div>
    );
};

export default statusIndicator;
