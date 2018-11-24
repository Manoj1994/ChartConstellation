package chartconstellation.app.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

import chartconstellation.app.appconfiguration.Configuration;
import chartconstellation.app.entities.FeatureDistance;
import chartconstellation.app.entities.FeatureVector;
import chartconstellation.app.entities.MongoCollections;

@Component
public class TextDocsUtil {

    @Autowired
    DbUtil dbUtil;

    @Autowired
    DocumentUtil docutil;

    @Autowired
    AttributeUtil attributeUtil;

    @Autowired
    FeatureMergeUtil featureMergeUtil;

    @Autowired
    MongoClient mongoClient;

    @Autowired
    Configuration configuration;

    public void loadDocs() {

        // Loading dataset 1

        List<DBObject> dobobjects = docutil.convertToDBObjectList(configuration.getInputPath());

        dbUtil.updateDBDocs(dobobjects, configuration.getMongoDatabase(), configuration.getOlympicchartcollection());

        DBCollection collection = mongoClient.getDB(configuration.getMongoDatabase())
                .getCollection(configuration.getOlympicchartcollection());

        List<FeatureDistance> attrDistances = attributeUtil.computerAttributeDistance(collection);

        dbUtil.updateAttributeCollection(configuration.getMongoDatabase(),
                configuration.getAttributeDistanceCollection(),
                attrDistances);

        List<FeatureDistance> descriptionDistances =
                docutil.convertJsonToFeatureList(configuration.getDescriptionDistancePath());

        dbUtil.updateAttributeCollection(configuration.getMongoDatabase()
                , configuration.getDescriptionCollection()
                , descriptionDistances );

        MongoCollections mongoCollections = dbUtil.getCollections(configuration.getMongoDatabase());

        List<FeatureVector> featureVectors = featureMergeUtil.mergeAllFeatures(mongoCollections);


        dbUtil.updateFeaturesCollection(configuration.getMongoDatabase()
                , configuration.getTotalFeatureCollection()
                , featureVectors);

        // loading dataset2
        List<DBObject> dobobjects2 = docutil.convertToDBObjectList(configuration.getDataset2inputPath());

        dbUtil.updateDBDocs(dobobjects2, configuration.getMongoDatabase(), configuration.getCrimechartcollection());

        DBCollection collection2 = mongoClient.getDB(configuration.getMongoDatabase())
                .getCollection(configuration.getCrimechartcollection());

        List<FeatureDistance> attrDistances2 = attributeUtil.computerAttributeDistance(collection2);

        System.out.println(attrDistances2.size());

        dbUtil.updateAttributeCollection(configuration.getMongoDatabase(),
                configuration.getDataset2attributeDistanceCollection(),
                attrDistances2);


    }

}
