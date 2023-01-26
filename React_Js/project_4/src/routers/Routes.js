import React, { Fragment } from 'react';
import {
    Route
} from "react-router-dom";
import ImageManagerPage from '../components/ImageManager/ImageManagerPage';
import ExportPage from '../components/Export/ExportPage';
import ImageMatchServerPage from '../components/ImageMatchServer/ImageMatchServerPage';
import ProcessingQueuePage from '../components/ProcessingQueue/ProcessingQueuePage';
import CroppedImageManagerPage from '../components/CroppedImageManager/CroppedImageManagerPage';
import ProcessingQueueDetailsPage from '../components/ProcessingQueue/ProcessingQueueDetailsPage';
import BodyRegionPage from '../components/BodyRegion/BodyRegionPage';
import { typesRoutes } from './typesRoutes';
import { useSelector } from 'react-redux';
import CaseDetailsPage from '../components/Case/CaseDetailsPage';
import ImageComparisonPage from "../components/ImageComparison/ImageComparisonPage";
import SuggestedPrelimReportComparisonPage from '../components/Report/SuggestedPrelimReportComparisonPage';
import ExportQueuePage from "../components/Report/ExportQueuePage";
import DataExportToolPage from "../components/Report/DataExportToolPage";
import ExportPageRoutes from "./ExportPageRoutes";

const Routes = () => {

    const user = useSelector(state => state.auth.user);

    return (
        <Fragment>
            <Route exact path={ typesRoutes.ImageManager } component={ ImageManagerPage }/>
            <Route exact path={ typesRoutes.ImageMatchServer } component={ ImageMatchServerPage }/>
            <Route exact path={ typesRoutes.CroppedImageManager } component={ CroppedImageManagerPage }/>
            <Route exact path={ typesRoutes.ImageExports } component={ ExportPage }/>
            <Route exact path={ typesRoutes.ProcessingQueue } component={ ProcessingQueuePage }/>
            <Route exact path={ typesRoutes.ProcessingQueueDetails } component={ ProcessingQueueDetailsPage }/>
            <Route exact path={ typesRoutes.BodyRegions } component={ BodyRegionPage }/>
            <Route exact path={ typesRoutes.SubBodyRegions } component={()=>(user.id !== 0 && <BodyRegionPage />)}/>
            <Route exact path={ typesRoutes.CaseDetails } component={ CaseDetailsPage }/>
            <Route exact path={ typesRoutes.ImageComparison } component={ ImageComparisonPage }/>
            <Route exact path={ typesRoutes.SuggestedPrelimReportComparison } component={ SuggestedPrelimReportComparisonPage }/>
            <Route exact path={ typesRoutes.DataExportQueue } component={ ExportQueuePage }/>
            <Route exact path={ typesRoutes.DataExportTool } component={ DataExportToolPage }/>
            <ExportPageRoutes />
        </Fragment>
    )
};

export default Routes;
