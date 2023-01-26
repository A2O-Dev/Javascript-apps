const prefix = "/r";

export const typesRoutes = {
    ImageManager: `${ prefix }/image-manager`,
    ImageMatchServer: `${ prefix }/image-match-server`,
    CroppedImageManager: `${ prefix }/cropped-image-manager`,
    ImageExports: `${ prefix }/image-exports`,
    ProcessingQueue: `${ prefix }/processing-queue`,
    ProcessingQueueDetails: `${ prefix }/processing-queue-details/:id`,
    BodyRegions: `${ prefix }/body-regions`,
    SubBodyRegions: `${ prefix }/body-regions/:id/sub-body-regions`,
    CaseDetails: `${ prefix }/cases/:id`,
    ImageComparison: `${ prefix }/image-comparison`,
    SuggestedPrelimReportComparison: `${ prefix }/suggested-prelim-report-comparison`,
    DataExportQueue: `${ prefix }/data-export-queue`,
    DataExportTool: `${ prefix }/data-export-tool`
}
