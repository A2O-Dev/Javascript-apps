import React, {Fragment, useEffect, useState} from 'react';
import {
    Route
} from "react-router-dom";
import { typesRoutes } from './typesRoutes';
import AiReportDataExportTypeService from "../services/AiReportDataExportTypeService";

const ExportPageRoutes = () => {

    const aiReportDataExportTypeService = new AiReportDataExportTypeService();
    const [exportPageList, setExportPageList] = useState([]);

    const importComponent = (frontPage, exportName) => {
        let component;
        try {
            component = require(`../components/DataExportToolPages/${frontPage}`).default
        } catch (e) {
            console.log(`Page ${!!frontPage ? frontPage + ' ' : ''}to ${exportName} not found`);
        }
        return component;
    }

    useEffect(() => {
        aiReportDataExportTypeService.getAll()
            .then((httpSuccess) => {
                const aiReportDataExportTypeList = httpSuccess.data.results;
                const routePageList = aiReportDataExportTypeList.map(aiReportDataExportType => ({
                    key: aiReportDataExportType.id,
                    path: `${typesRoutes.DataExportTool}/${aiReportDataExportType.code.replace(/_/g, '-')}`,
                    component: importComponent(aiReportDataExportType.front_page, aiReportDataExportType.name)
                }));
                setExportPageList(routePageList);
            });
    }, []);

    return exportPageList.map(exportPage => {
        if (!!exportPage.component) {
            return (
                <Route
                    key={exportPage.key}
                    exact
                    path={exportPage.path}
                    component={exportPage.component}
                />
            )
        } else {
            return <Fragment key={exportPage.key}/>
        }
    });

};

export default ExportPageRoutes;
