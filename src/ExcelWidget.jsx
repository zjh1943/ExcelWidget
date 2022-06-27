import { Component, createElement } from "react";
import DataGrid, { TextEditor } from "react-data-grid";

// const pino = require("pino");
// const pretty = require("pino-pretty");
const logger = console;
// logger.debug = () => {};

const ValueState = {
    Loading: "loading",
    Unavailable: "unavailable",
    Available: "available"
};

export class ExcelWidget extends Component {
    constructor(props) {
        super(props);
        this.rowDict = {};
    }

    createColumns = columns => {
        logger.debug(`createColumns. params:columns = `, columns);
        const ret = [];
        columns.forEach(col => {
            const colObj = {
                key: col.columnKey.id,
                name: col.headerName.status === ValueState.Available ? col.headerName.value : "-"
                // editor: col.editable ? TextEditor : undefined // Because of the limitation of mendix framework, Value in ListValue can not be editable. So I have to give up this method.
            };
            ret.push(colObj);
        });
        logger.debug(`createColumns. return =`, ret);
        return ret;
    };

    createRows = (columns, datasource) => {
        logger.debug(`createRows. params:datasource = `, datasource);
        const ret = [];
        const attributes = columns.map(col => col.columnKey);
        if (datasource.status === ValueState.Available) {
            datasource.items.forEach(item => {
                // logger.debug("createRows. ListValue = ", item);
                const retItem = { id: item.id };
                attributes.forEach(attr => {
                    const key = attr.id;
                    const editableValue = attr.get(item);
                    // logger.debug("createRows(). editableValue = ", editableValue);
                    // logger.debug("createRows(). editableValue.readOnly = ", editableValue.readOnly);
                    const realValue = editableValue.value;
                    retItem[key] = realValue;
                });
                ret.push(retItem);
            });
        }
        logger.debug(`createRows. return =`, ret);
        return ret;
    };

    onRowClick = (row, column) => {
        logger.debug("onRowClick: row = ", row, "column = ", column);
        const { onRowClick, datasource } = this.props;
        if (!onRowClick) return;

        const item = datasource.items.find(it => it.id === row.id);
        logger.debug("onRowClick: item = ");
        if (item) {
            const actionValue = onRowClick.get(item);
            logger.debug("onRowClick: actionValue = ", actionValue);
            actionValue.execute();
        }
    };

    render() {
        const columns = this.createColumns(this.props.columns);
        const rows = this.createRows(this.props.columns, this.props.datasource);
        return <DataGrid columns={columns} rows={rows} onRowClick={this.onRowClick} />;
    }
}
