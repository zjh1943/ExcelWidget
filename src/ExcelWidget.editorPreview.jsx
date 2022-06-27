import { Component, createElement } from "react";

import { ExcelWidget } from "./ExcelWidget";

export function preview(props) {
    return <ExcelWidget {...props} />;
}
