alte.component('titleReport', {
    templateUrl: 'assets/components/searchTitles/titleReport.template.html?v=' + window.ASSETS_VERSION,
    bindings: {
        titleItem: '<',
        header: '<',
        onBack: '&'
    },
    controllerAs: 'cm',
    controller: function ($scope, $window, authService, titleBookPageService, titleDetailService, mortgageService, lienService,
                          easementService, miscCivilProbateService, covenantSecondaryDocumentService, deedService, taxService) {

        let cm = this;
        cm.authService = authService;
        cm.owner = authService.getUser();
        cm.loading = false;
        cm.errors = {};
        cm.pageMessages = {};
        cm.sale = {};
        cm.titleItem = null;
        cm.titleBookPageDefList = [
            {
                code: 'plat',
                name: 'Plat Book + Page',
                shortName: 'Plat ',
                hasResults: false
            },
            {
                code: 'revised',
                name: 'Revised Plat at Book + Page',
                shortName: 'Revised Plat ',
                hasResults: false
            },
            {
                code: 'floor_plans',
                name: 'Floor Plans Book + Page',
                shortName: 'Floor Plans ',
                hasResults: false
            },
            {
                code: 'revised_floor_plans',
                name: 'Revised Floor Plans at Book + Page',
                shortName: 'Revised Floor Plans ',
                hasResults: false
            }
        ];
        cm.miscCivilProbateDefList = [
            {
                code: 'miscellaneous',
            },
            {
                code: 'civil',
            },
            {
                code: 'probate',
            }
        ];

        cm.zoneDefList = ["nw", "ne", "sw", "se"];
        cm.docHelper = new TitleDocumentHelper();


        cm.$onInit = function () {
            cm.sale = window.sale;
            if (window.titleItem != null)
                cm.titleItem = window.titleItem;
        };

        cm.$onChanges = function () {
            if (window.titleItem != null)
                cm.titleItem = window.titleItem;

            if (window.header != null)
                cm.header = window.header;

            if (cm.titleItem != null) {
                if (cm.titleItem.id != null) {
                    titleBookPageService.getAll(cm.titleItem).then(function (httpSuccess) {
                        cm.titleItem.titleBookPageList = httpSuccess.data.results;
                        angular.forEach(cm.titleBookPageDefList, function (titleBookPageDef) {
                            titleBookPageDef.hasResults = (cm.titleItem.titleBookPageList.find(function (item) {
                                return item.type == titleBookPageDef.code;
                            }) != null);
                        });
                        cm.titleItem.titleBookPageList = cm.sortDocuments(cm.titleItem.titleBookPageList);

                    }, function (httpError) {
                        console.error(httpError);
                    });
                }

                if (cm.titleItem.titleBookPageList != null && cm.titleItem.titleBookPageList.length > 0) {
                    angular.forEach(cm.titleBookPageDefList, function (titleBookPageDef) {
                        titleBookPageDef.hasResults = (cm.titleItem.titleBookPageList.find(function (item) {
                            return item.type == titleBookPageDef.code;
                        }) != null);
                    });
                    cm.titleItem.titleBookPageList = cm.sortDocuments(cm.titleItem.titleBookPageList);
                }

                if (cm.titleItem.id != null) {
                    titleDetailService.get(cm.titleItem).then(function (httpSuccess) {
                        if (httpSuccess.data.results.length > 0) {
                            cm.titleItem.titleDetail = httpSuccess.data.results[0];
                            if (cm.titleItem.titleDetail.searchDateUpdated != null) {
                                if (cm.titleItem.titleDetail.searchDateUpdated.date != null && typeof cm.titleItem.titleDetail.searchDateUpdated.date != 'function') {
                                    cm.titleItem.titleDetail.searchDateUpdated = moment(cm.titleItem.titleDetail.searchDateUpdated.date);
                                }
                            }
                        } else
                            cm.tmpTitleDetail = {};
                    }, function (httpError) {
                        console.error(httpError);
                    });
                }


                if (cm.titleItem.mortgageList != null && cm.titleItem.mortgageList.length > 0) {
                    cm.titleItem.mortgageList.sort(function (docA, docB) {
                        return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                    });
                    angular.forEach(cm.titleItem.mortgageList, function (mortgage) {
                        if (mortgage.deedDate != null && mortgage.deedDate.date != null && typeof mortgage.deedDate.date != 'function') {
                            mortgage.deedDate = moment(mortgage.deedDate.date);
                        }
                        if (mortgage.deedDate != null && mortgage.recDate.date != null && typeof mortgage.recDate.date != 'function') {
                            mortgage.recDate = moment(mortgage.recDate.date);
                        }
                        if (mortgage.secondaryDocumentList != null && mortgage.secondaryDocumentList.length > 0) {
                            mortgage.secondaryDocumentList = cm.sortDocumentsGroupByDeedType(mortgage.secondaryDocumentList);
                        }
                    });
                }
                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'onlyMaster': true,
                        'limit': 500,
                        'order[0][column]': 'deedBook',
                        'order[0][dir]': 'desc'
                    };
                    let paramsSecondary = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'deedTypeId',
                        'order[0][dir]': 'asc'
                    };
                    mortgageService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.mortgageList = angular.copy(httpSuccess.data.results);

                        if (cm.titleItem.mortgageList.length > 0) {
                            cm.titleItem.mortgageList.sort(function (docA, docB) {
                                return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                            });

                            cm.tmpMortgage = [];
                            angular.forEach(cm.titleItem.mortgageList, function (mortgage) {
                                if (mortgage.deedDate != null && mortgage.deedDate.date != null && typeof mortgage.deedDate.date != 'function') {
                                    mortgage.deedDate = moment(mortgage.deedDate.date);
                                }
                                if (mortgage.deedDate != null && mortgage.recDate.date != null && typeof mortgage.recDate.date != 'function') {
                                    mortgage.recDate = moment(mortgage.recDate.date);
                                }
                                mortgageService.getAllDocSecondary(mortgage, paramsSecondary).then(function (httpSuccess) {
                                    mortgage.secondaryDocumentList = angular.copy(httpSuccess.data.results);
                                    if (mortgage.secondaryDocumentList.length > 0) {
                                        mortgage.secondaryDocumentList = cm.sortDocumentsGroupByDeedType(mortgage.secondaryDocumentList);
                                    }
                                });

                            });
                        }
                    });
                }

                if (cm.titleItem.dateSearch != null) {
                    if (cm.titleItem.dateSearch.date != null && typeof cm.titleItem.dateSearch.date != 'function') {
                        cm.titleItem.dateSearch = moment(cm.titleItem.dateSearch.date);
                    }
                }

                if (cm.titleItem.dateEffective != null) {
                    if (cm.titleItem.dateEffective.date != null && typeof cm.titleItem.dateEffective.date != 'function') {
                        cm.titleItem.dateEffective = moment(cm.titleItem.dateEffective.date);
                    }
                }

                if (cm.titleItem.easementList != null && cm.titleItem.easementList.length > 0) {
                    angular.forEach(cm.titleItem.easementList, function (easement) {

                        if (easement.deedDate != null && easement.deedDate.date != null && typeof easement.deedDate.date != 'function') {
                            easement.deedDate = moment(easement.deedDate.date);
                        }
                        if (easement.deedDate != null && easement.recDate.date != null && typeof easement.recDate.date != 'function') {
                            easement.recDate = moment(easement.recDate.date);
                        }
                    });
                    cm.titleItem.easementList.sort(function (docA, docB) {
                        return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                    });
                }

                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'deedBook',
                        'order[0][dir]': 'desc'
                    };
                    easementService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.easementList = angular.copy(httpSuccess.data.results);
                        if (cm.titleItem.easementList.length > 0) {
                            angular.forEach(cm.titleItem.easementList, function (easement) {

                                if (easement.deedDate != null && easement.deedDate.date != null && typeof easement.deedDate.date != 'function') {
                                    easement.deedDate = moment(easement.deedDate.date);
                                }
                                if (easement.deedDate != null && easement.recDate.date != null && typeof easement.recDate.date != 'function') {
                                    easement.recDate = moment(easement.recDate.date);
                                }
                            });
                            cm.titleItem.easementList.sort(function (docA, docB) {
                                return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                            });
                        }
                    });
                }

                if (cm.titleItem.deedList != null && cm.titleItem.deedList.length > 0) {
                    angular.forEach(cm.titleItem.deedList, function (deed) {

                        if (deed.deedDate.date != null && typeof deed.deedDate.date != 'function') {
                            deed.deedDate = moment(deed.deedDate.date);
                        }
                        if (deed.recDate.date != null && typeof deed.recDate.date != 'function') {
                            deed.recDate = moment(deed.recDate.date);
                        }
                    });
                    cm.titleItem.deedList.sort(function (docA, docB) {
                        return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage'], true);
                    });
                    cm.quantityPastOwnerDeed = cm.titleItem.deedList.length - 1;
                } else {
                    cm.quantityPastOwnerDeed = 0;
                }
                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'book',
                        'order[0][dir]': 'asc'
                    };
                    deedService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.deedList = angular.copy(httpSuccess.data.results);
                        if (cm.titleItem.deedList.length > 0) {
                            angular.forEach(cm.titleItem.deedList, function (deed) {

                                if (deed.deedDate.date != null && typeof deed.deedDate.date != 'function') {
                                    deed.deedDate = moment(deed.deedDate.date);
                                }
                                if (deed.recDate.date != null && typeof deed.recDate.date != 'function') {
                                    deed.recDate = moment(deed.recDate.date);
                                }
                            });
                            cm.titleItem.deedList.sort(function (docA, docB) {
                                return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage'], true);
                            });
                            cm.quantityPastOwnerDeed = cm.titleItem.deedList.length - 1;
                        } else {
                            cm.quantityPastOwnerDeed = 0;
                        }
                    });
                }

                if (cm.titleItem.taxList != null && cm.titleItem.taxList.length > 0)
                    angular.forEach(cm.titleItem.taxList, function (tax, index) {
                        if (tax.accountNumber == null && tax.amountOwned == null && tax.amountPaid == null && tax.assessedValue == null
                            && tax.county == null && tax.dateDue == null && tax.datePaid == null && tax.municipalAmountOwned == null && tax.municipalAmountPaid == null
                            && tax.municipalDateDue == null && tax.municipalDatePaid == null && tax.municipality == null && tax.parcelId == null
                            && tax.sanitation == null && tax.sewer == null && tax.taxPayerName == null && tax.taxYear == null) {
                            cm.titleItem.taxList.splice(index, 1);
                        } else {
                            if (tax.dateDue != null && tax.dateDue.date != null && typeof tax.dateDue.date != 'function') {
                                tax.dateDue = moment(tax.dateDue.date);
                            }
                            if (tax.datePaid != null && tax.datePaid.date != null && typeof tax.datePaid.date != 'function') {
                                tax.datePaid = moment(tax.datePaid.date);
                            }
                            if (tax.municipalDateDue != null && tax.municipalDateDue.date != null && typeof tax.municipalDateDue.date != 'function') {
                                tax.municipalDateDue = moment(tax.municipalDateDue.date);
                            }
                            if (tax.municipalDatePaid != null && tax.municipalDatePaid.date != null && typeof tax.municipalDatePaid.date != 'function') {
                                tax.municipalDatePaid = moment(tax.municipalDatePaid.date);
                            }
                        }
                    });

                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'dateDue',
                        'order[0][dir]': 'asc',
                        'order[0][column]': 'createdAt',
                        'order[0][dir]': 'asc',
                        'order[0][column]': 'municipalDateDue',
                        'order[0][dir]': 'asc'
                    };
                    taxService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.taxList = angular.copy(httpSuccess.data.results);
                        angular.forEach(cm.titleItem.taxList, function (tax, index) {
                            if (tax.accountNumber == null && tax.amountOwned == null && tax.amountPaid == null && tax.assessedValue == null
                                && tax.county == null && tax.dateDue == null && tax.datePaid == null && tax.municipalAmountOwned == null && tax.municipalAmountPaid == null
                                && tax.municipalDateDue == null && tax.municipalDatePaid == null && tax.municipality == null && tax.parcelId == null
                                && tax.sanitation == null && tax.sewer == null && tax.taxPayerName == null && tax.taxYear == null) {
                                cm.titleItem.taxList.splice(index, 1);
                            } else {
                                if (tax.dateDue != null && tax.dateDue.date != null && typeof tax.dateDue.date != 'function') {
                                    tax.dateDue = moment(tax.dateDue.date);
                                }
                                if (tax.datePaid != null && tax.datePaid.date != null && typeof tax.datePaid.date != 'function') {
                                    tax.datePaid = moment(tax.datePaid.date);
                                }
                                if (tax.municipalDateDue != null && tax.municipalDateDue.date != null && typeof tax.municipalDateDue.date != 'function') {
                                    tax.municipalDateDue = moment(tax.municipalDateDue.date);
                                }
                                if (tax.municipalDatePaid != null && tax.municipalDatePaid.date != null && typeof tax.municipalDatePaid.date != 'function') {
                                    tax.municipalDatePaid = moment(tax.municipalDatePaid.date);
                                }
                            }
                        });
                    });
                }


                if (cm.titleItem.lienList != null && cm.titleItem.lienList.length > 0) {
                    cm.titleItem.lienList.sort(function (docA, docB) {
                        return cm.docHelper.compare(docA, docB, ['book', 'page']);
                    });
                    cm.tmpLiens = [];
                    angular.forEach(cm.titleItem.lienList, function (lien) {
                        if (lien.secondaryDocumentList != null && lien.secondaryDocumentList.length > 0) {
                            lien.secondaryDocumentList = cm.sortDocumentsGroupByDeedType(lien.secondaryDocumentList);
                        }
                    });
                }
                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'onlyMaster': true,
                        'limit': 500,
                        'order[0][column]': 'book',
                        'order[0][dir]': 'desc'
                    };
                    let paramsSecondary = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'deedTypeId',
                        'order[0][dir]': 'asc'
                    };
                    lienService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.lienList = angular.copy(httpSuccess.data.results);

                        if (cm.titleItem.lienList.length > 0) {
                            cm.titleItem.lienList.sort(function (docA, docB) {
                                return cm.docHelper.compare(docA, docB, ['book', 'page']);
                            });
                            cm.tmpLiens = [];
                            angular.forEach(cm.titleItem.lienList, function (lien) {
                                lienService.getAllDocSecondary(lien, paramsSecondary).then(function (httpSuccess) {
                                    lien.secondaryDocumentList = angular.copy(httpSuccess.data.results);
                                    if (lien.secondaryDocumentList.length > 0) {
                                        lien.secondaryDocumentList = cm.sortDocumentsGroupByDeedType(lien.secondaryDocumentList);
                                    }
                                });

                            });
                        }
                    });
                }

                if (cm.titleItem.miscCivilProbateList != null && cm.titleItem.miscCivilProbateList.length > 0) {
                    cm.titleItem.miscCivilProbateList = cm.sortDoc(cm.titleItem.miscCivilProbateList, [['miscellaneous', []], ['civil', []], ['probate', []]], ['book', 'page', 'fileNumber']);
                }
                if (cm.titleItem.id != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'deedTypeId',
                        'order[0][dir]': 'asc'
                    };
                    miscCivilProbateService.getAll(cm.titleItem, params).then(function (httpSuccess) {
                        cm.titleItem.miscCivilProbateList = angular.copy(httpSuccess.data.results);
                        if (cm.titleItem.miscCivilProbateList.length > 0) {
                            cm.titleItem.miscCivilProbateList = cm.sortDoc(cm.titleItem.miscCivilProbateList, [['miscellaneous', []], ['civil', []], ['probate', []]], ['book', 'page', 'fileNumber']);
                        }
                    });
                }

                if (cm.titleItem.covenant != null) {
                    let params = {
                        'arrayFormat': 'full',
                        'limit': 500,
                        'order[0][column]': 'deedBook',
                        'order[0][dir]': 'desc'
                    };
                    covenantSecondaryDocumentService.getAll(cm.titleItem.covenant, params).then(function (httpSuccess) {
                        cm.titleItem.covenant.secondaryDocumentList = angular.copy(httpSuccess.data.results);
                        if (cm.titleItem.covenant.secondaryDocumentList.length > 0) {
                            cm.titleItem.covenant.secondaryDocumentList.sort(function (docA, docB) {
                                return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                            });
                        }
                    });
                    if (cm.titleItem.covenant.dateRecorded != null && cm.titleItem.covenant.dateRecorded.date != null && typeof cm.titleItem.covenant.dateRecorded != 'function') {
                        cm.titleItem.covenant.dateRecorded = moment(cm.titleItem.covenant.dateRecorded.date);
                    }
                    if (cm.titleItem.covenant.instrumentDate != null && cm.titleItem.covenant.instrumentDate.date != null && typeof cm.titleItem.covenant.instrumentDate != 'function') {
                        cm.titleItem.covenant.instrumentDate = moment(cm.titleItem.covenant.instrumentDate.date);
                    }
                    if (cm.titleItem.covenant.secondaryDocumentList.length > 0) {
                        cm.titleItem.covenant.secondaryDocumentList.sort(function (docA, docB) {
                            return cm.docHelper.compare(docA, docB, ['deedBook', 'deedPage']);
                        });
                    }
                }
            }
        };


        cm.filterTitleBookPage = function (type) {
            return function (titleBookPage) {
                return titleBookPage.type == type;
            };
        };

        cm.sortDoc = function (docList, iterator, attributeList = ['book', 'page']) {
            let map = new Map(iterator);
            docList.forEach(function (doc) {
                if (map.has(doc.deedType.code))
                    map.get(doc.deedType.code).push(doc);
            });
            let tmpDocList = [];
            map.forEach(function (value, key) {
                value.sort(function (docA, docB) {
                    return cm.docHelper.compare(docA, docB, attributeList);
                });
                tmpDocList = tmpDocList.concat(value);
            });
            return tmpDocList;
        };


        cm.sortDocuments = function (documentList) {
            if (documentList != null && documentList.length > 0) {
                let documentListMapped = [];

                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'mortgage' || documentList[0].deedType.docType == 'easement'
                    || documentList[0].deedType.docType == 'lease' || documentList[0].deedType.docType == 'deed'
                    || documentList[0].deedType.docType == 'covenant')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.deedBook != null) {
                            return {
                                index: i, valueBook: doc.deedBook.toUpperCase(), valuePage: doc.deedPage.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }
                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'lien' || documentList[0].deedType.docType == 'misc_civil_probate')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.book != null) {
                            return {
                                index: i, valueBook: doc.book.toUpperCase(), valuePage: doc.page.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }
                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'plat_floor_plan')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.platBook != null) {
                            return {
                                index: i, valueBook: doc.platBook.toUpperCase(), valuePage: doc.platPage.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }

                if (!documentList[0].hasOwnProperty('deedType') && (documentList[0].hasOwnProperty('type'))) {
                    documentListMapped = documentList.map(function (doc, i) {
                        if (doc.book != null) {
                            return {
                                index: i, valueBook: doc.book.toUpperCase(), valuePage: doc.page.toUpperCase(),
                                docType: doc.type
                            };
                        } else {
                            return {index: i, value: doc, docType: doc.type}
                        }
                    });
                }

                documentListMapped.sort(function (a, b) {
                    // if (a.docType == b.docType) {
                    if (a.valueBook != null) {
                        if (b.valueBook != null) {
                            if (cm.compareLessThan(a.valueBook, b.valueBook) > 0) {
                                return -1;
                            }
                            if (cm.compareLessThan(a.valueBook, b.valueBook) < 0) {
                                return 1;
                            }

                            if (cm.compareLessThan(a.valuePage, b.valuePage) > 0) {
                                return -1;
                            }
                            if (cm.compareLessThan(a.valuePage, b.valuePage) < 0) {
                                return 1;
                            }
                            return 0;

                        }
                        return 1;
                    }
                    return 1;
                    // } else
                    //     return 0;
                });
                let documentListSorted = documentListMapped.map(function (doc) {
                    return documentList[doc.index];
                });

                return documentListSorted;
            }
            return [];

        };

        cm.sortDocumentsGroupByDeedType = function (documentList) {
            if (documentList != null && documentList.length > 0) {
                let documentListMapped = [];

                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'mortgage' || documentList[0].deedType.docType == 'easement'
                    || documentList[0].deedType.docType == 'lease' || documentList[0].deedType.docType == 'deed'
                    || documentList[0].deedType.docType == 'covenant')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.deedBook != null) {
                            return {
                                index: i, valueBook: doc.deedBook.toUpperCase(), valuePage: doc.deedPage.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }
                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'lien' || documentList[0].deedType.docType == 'misc_civil_probate')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.book != null) {
                            return {
                                index: i, valueBook: doc.book.toUpperCase(), valuePage: doc.page.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }
                if (documentList[0].hasOwnProperty('deedType') && (documentList[0].deedType.docType == 'plat_floor_plan')) {
                    documentListMapped = documentList.map(function (doc, i) {

                        if (doc.platBook != null) {
                            return {
                                index: i, valueBook: doc.platBook.toUpperCase(), valuePage: doc.platPage.toUpperCase(),
                                docType: doc.deedType.code
                            };
                        } else {
                            return {index: i, value: doc}
                        }
                    });
                }

                if (!documentList[0].hasOwnProperty('deedType') && (documentList[0].hasOwnProperty('type'))) {
                    documentListMapped = documentList.map(function (doc, i) {
                        if (doc.book != null) {
                            return {
                                index: i, valueBook: doc.book.toUpperCase(), valuePage: doc.page.toUpperCase(),
                                docType: doc.type
                            };
                        } else {
                            return {index: i, value: doc, docType: doc.type}
                        }
                    });
                }

                documentListMapped.sort(function (a, b) {
                    if (a.docType == b.docType) {
                        if (a.valueBook != null) {
                            if (b.valueBook != null) {
                                if (cm.compareLessThan(a.valueBook, b.valueBook) > 0) {
                                    return -1;
                                }
                                if (cm.compareLessThan(a.valueBook, b.valueBook) < 0) {
                                    return 1;
                                }

                                if (cm.compareLessThan(a.valuePage, b.valuePage) > 0) {
                                    return -1;
                                }
                                if (cm.compareLessThan(a.valuePage, b.valuePage) < 0) {
                                    return 1;
                                }
                                return 0;

                            }
                            return 1;
                        }
                        return 1;
                    } else
                        return 0;
                });
                let documentListSorted = documentListMapped.map(function (doc) {
                    return documentList[doc.index];
                });

                return documentListSorted;
            }
            return [];

        };

        cm.extractLetters = function (text) {
            for (let i = 0; text.length >= i; i++) {
                if (!isNaN(text.charAt(i))) {
                    y = text.substr(0, i);
                    return y;
                }
            }
            return '';
        };

        cm.formatAmount = function (number) {
            return number.replaceAll(',', '');
        };

        cm.snakeToString = function (snakeString) {
            if (snakeString != null) {
                return snakeString.replace('_', " ");
            }
            return '';
        };

        cm.partitionWord = function (txt) {
            txt = txt.trim();
            let wordList = [];
            while (txt.length > 0) {
                if (isNaN(txt.charAt(0))) { //letters
                    let word = cm.extractLetters(txt);
                    txt = txt.slice(word.length);
                    wordList.push(word);
                } else {
                    let numberTxt = cm.extractNumbers(txt);
                    txt = txt.slice(numberTxt.length);
                    wordList.push(numberTxt);
                }
            }
            return wordList;
        };

        cm.compareLessThan = function (strA, strB) {
            let partitionA = cm.partitionWord(strA);
            let partitionB = cm.partitionWord(strB);
            let lessSize = partitionA.length;
            if (lessSize > partitionB.length) lessSize = partitionB.length;
            let index = 0;
            let result = 0;
            while (index < lessSize) {
                let partA = partitionA[index];
                let partB = partitionB[index];
                if (isNaN(partA) && !isNaN(partB))
                    result = 1;

                if (!isNaN(partA) && isNaN(partB))
                    result = -1;

                if (isNaN(partA) && isNaN(partB))//both letters
                    result = cm.compareLessWord(partA, partB);

                if (!isNaN(partA) && !isNaN(partB)) { //both numbers
                    if (parseInt(partA) < parseInt(partB))
                        result = 1;
                    if (parseInt(partA) > parseInt(partB))
                        result = -1;
                }

                if (result == 0)
                    index++;
                else break;
            }
            if (result == 0) {
                if (partitionA.length < partitionB.length)
                    result = 1;
                if (partitionA.length > partitionB.length)
                    result = -1;
            }
            return result;
        };

        cm.compareLessWord = function (wordA, wordB) {
            if (wordA.length < wordB.length) {
                return 1;
            }
            if (wordA.length > wordB.length) {
                return -1;
            }
            let result = 0;
            for (const [index, charA] of wordA.split('').entries()) {
                let charB = wordB.charAt(index);
                let compareResult = cm.compareLessChar(charA, charB);
                if (compareResult != 0) {
                    return compareResult;
                }
            }
            return result;
        };

        cm.compareLessChar = function (charA, charB) {
            if (isNaN(charA) && isNaN(charB)) {
                if (charA.charCodeAt(0) < charB.charCodeAt(0))
                    return 1;
                if (charA.charCodeAt(0) > charB.charCodeAt(0))
                    return -1;
                return 0;
            } else {
                if (isNaN(charA))
                    return 1;
                if (isNaN(charB))
                    return -1;

                if (charA.charCodeAt(0) < charB.charCodeAt(0))
                    return 1;
                if (charA.charCodeAt(0) > charB.charCodeAt(0))
                    return -1;
                return 0;
            }

        };

        cm.extractNumbers = function (str) {
            let numbersList = str.match(/\d+/);
            if (numbersList == null || numbersList.length == 0)
                return undefined;
            return numbersList[0];
        };
    }
});