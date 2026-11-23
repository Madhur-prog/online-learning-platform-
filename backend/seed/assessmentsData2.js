// LearnSphere Comprehensive Assessment Dataset (Part 2: Courses 6 to 10)
// 5 Courses x 3 Quizzes (Beginner: 5 Qs, Intermediate: 7 Qs, Advanced: 10 Qs) = 15 Quizzes (110 MCQs)
// 5 Courses x 3 Assignments (Beginner: 20 pts, Intermediate: 30 pts, Advanced: 50 pts) = 15 Assignments

const assessmentsPart2 = [
  // 6. MongoDB Fundamentals
  {
    courseTitle: 'MongoDB Fundamentals',
    quizzes: [
      {
        title: 'MongoDB & NoSQL Document Model Quiz',
        difficulty: 'Beginner',
        description: 'Test foundational knowledge of BSON documents, collections, ObjectIDs, and basic query operators.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the binary representation format used by MongoDB to store JSON-like documents on disk?',
            options: ['BSON (Binary JSON)', 'Protocol Buffers', 'MessagePack', 'XML Binary'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'MongoDB stores documents in BSON format, which extends JSON with data types like Date and raw binary data.'
          },
          {
            questionText: 'What is the standard byte length of an automatically generated MongoDB `ObjectId`?',
            options: ['12 bytes (24 hex characters)', '16 bytes (32 hex characters)', '8 bytes (16 hex characters)', '4 bytes (8 hex characters)'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An ObjectId is a 12-byte BSON type composed of a 4-byte timestamp, 5-byte random value, and 3-byte incrementing counter.'
          },
          {
            questionText: 'Which query operator filters documents where a field\'s value is strictly greater than 50?',
            options: ['$gt: 50', '$gte: 50', '$above: 50', '$greater: 50'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$gt` is MongoDB\'s standard comparison operator for "greater than".'
          },
          {
            questionText: 'What command in `mongosh` inserts a single document into the `users` collection?',
            options: ['db.users.insertOne({ ... })', 'db.users.add({ ... })', 'db.users.create({ ... })', 'db.users.post({ ... })'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`db.collection.insertOne()` inserts a single document into the specified collection.'
          },
          {
            questionText: 'What is a collection in MongoDB analogous to in a traditional relational database?',
            options: ['A Table', 'A Row', 'A Column', 'A View'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'In MongoDB, collections hold documents, exactly analogous to how tables hold rows in relational databases.'
          }
        ]
      },
      {
        title: 'CRUD Operators, Updates & Array Filters',
        difficulty: 'Intermediate',
        description: 'Test intermediate querying, update modifiers ($set, $push, $inc), projection, and index creation.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which update operator increments the value of a numeric field by a specified amount in MongoDB?',
            options: ['$inc', '$add', '$sum', '$increment'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$inc` increments a field by a specified positive or negative value.'
          },
          {
            questionText: 'What does the `$push` operator do when applied to an array field in MongoDB?',
            options: [
              'Appends a specified value to an array',
              'Removes the last element from an array',
              'Sorts the array in ascending order',
              'Replaces the entire array with a single value'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$push` appends an item to an array field, creating the array if it did not previously exist.'
          },
          {
            questionText: 'How can you retrieve only the `title` and `author` fields while omitting all others including `_id` in a MongoDB find query?',
            options: [
              '`db.posts.find({}, { title: 1, author: 1, _id: 0 })`',
              '`db.posts.find({ select: ["title", "author"] })`',
              '`db.posts.find().only("title", "author")`',
              '`db.posts.find({}, { exclude: "_id" })`',
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Projection uses `1` for inclusion and `0` for exclusion. `_id` is included by default unless explicitly set to `0`.'
          },
          {
            questionText: 'What does the `upsert: true` option do in an update operation?',
            options: [
              'Updates matching documents, or inserts a new document if no documents match the query filter',
              'Performs an update in uppercase letters',
              'Forces an update to ignore schema validations',
              'Uploads the document to cloud backup'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`upsert: true` creates a new document based on the query and update operations if no match exists.'
          },
          {
            questionText: 'Which command creates a single-field ascending index on the `email` field?',
            options: [
              'db.users.createIndex({ email: 1 })',
              'db.users.addIndex("email", "ASC")',
              'db.users.index({ email: true })',
              'db.users.buildIndex("email")',
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`createIndex({ field: 1 })` builds an ascending B-tree index on the designated field.'
          },
          {
            questionText: 'What does the `$in` operator do in MongoDB queries?',
            options: [
              'Matches any document where the value of a field equals any value in the specified array',
              'Checks if a field contains an inner document',
              'Validates incoming HTTP request headers',
              'Translates text into multiple languages'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$in` selects documents where the field value matches any element in a list.'
          },
          {
            questionText: 'What is the default storage engine utilized by MongoDB in modern versions?',
            options: ['WiredTiger', 'MMAPv1', 'InnoDB', 'RocksDB'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'WiredTiger is the default storage engine, offering document-level concurrency control and compression.'
          }
        ]
      },
      {
        title: 'Aggregation Pipelines, Indexing Strategies & Sharding',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering aggregation stages ($match, $group, $lookup, $unwind), explain plans, and replica sets.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'In a MongoDB aggregation pipeline, which stage performs a left outer join to an unsharded collection in the same database?',
            options: ['$lookup', '$join', '$merge', '$foreign'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$lookup` performs an equality match join against another collection, returning matching documents in an array field.'
          },
          {
            questionText: 'What does the `$unwind` aggregation stage do to an array field?',
            options: [
              'Deconstructs an array field from the input documents to output a document for each element in the array',
              'Reverses the elements of an array',
              'Sorts the array elements alphabetically',
              'Compacts the array into a zip file'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$unwind` splits a document containing an array of N elements into N distinct documents.'
          },
          {
            questionText: 'What execution plan metric in `explain("executionStats")` indicates that a query scanned the entire collection without an index?',
            options: ['stage: "COLLSCAN"', 'stage: "IXSCAN"', 'stage: "PROJECTION_COVERED"', 'stage: "FETCH"'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`COLLSCAN` indicates a full collection scan (O(N)), meaning no suitable index was matched.'
          },
          {
            questionText: 'What is a Covered Query in MongoDB?',
            options: [
              'A query satisfied entirely by index keys without scanning any underlying documents from disk (totalDocsExamined: 0)',
              'A query encrypted using SSL/TLS certificates',
              'A query executed inside a database transaction',
              'A query protected by role-based access control'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A covered query can be answered completely by inspecting the index itself without loading document payloads into memory.'
          },
          {
            questionText: 'In MongoDB Replica Sets, what is the role of an Arbiter member?',
            options: [
              'Participates in leader elections to break voting ties but holds no data and cannot become a primary',
              'Takes automatic backups every hour',
              'Compresses old collections',
              'Serves read-only analytics queries'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An arbiter votes in elections without storing replication datasets, maintaining an odd number of voting nodes.'
          },
          {
            questionText: 'What is the maximum BSON document size limit enforced by MongoDB?',
            options: ['16 Megabytes', '32 Megabytes', '64 Megabytes', '4 Gigabytes'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The maximum single BSON document size is 16MB to prevent excessive memory consumption and ensure fast network transmission.'
          },
          {
            questionText: 'Which aggregation accumulator calculates the mathematical standard deviation of sample values in a `$group` stage?',
            options: ['$stdDevSamp', '$variance', '$avgDeviation', '$stdDev'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$stdDevSamp` computes the sample standard deviation of input values in the `$group` stage.'
          },
          {
            questionText: 'What architecture enables horizontal scaling of massive write throughput across multiple machines in MongoDB?',
            options: ['Sharding with Mongos routers and Shard Clusters', 'Master-Slave Replication', 'In-memory caching', 'B-Tree leaf splitting'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Sharding distributes datasets across multiple shards using a shard key, routed transparently by `mongos` processes.'
          },
          {
            questionText: 'What design anti-pattern occurs when continuously growing unbounded arrays inside a single MongoDB document?',
            options: [
              'Document Growth causing repeated disk page reallocations and eventually hitting the 16MB ceiling',
              'Database port exhaustion',
              'Automatic conversion to SQL table',
              'Replication lag of exactly 60 seconds'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Unbounded arrays lead to disk fragmentation and performance degradation, requiring migration to bucketed or referenced schemas.'
          },
          {
            questionText: 'What does the `$facet` aggregation stage allow developers to execute within a single pipeline?',
            options: [
              'Multiple parallel aggregation pipelines within a single stage on the same input documents',
              'Real-time video streaming from MongoDB',
              'Automatic multi-region data replication',
              'Full text translation into foreign languages'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`$facet` processes multiple aggregation pipelines simultaneously within a single stage, ideal for multi-attribute filtering.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Basic MongoDB Document Modeling & CRUD Operations',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Design a document schema for a bookstore, write mongosh scripts demonstrating insertOne, find with comparison filters, and field updates using $set and $inc.'
      },
      {
        title: 'Design an E-Commerce Document Schema and Aggregation Pipeline',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Implement an e-commerce document schema handling products, orders, and customer reviews. Build aggregation pipelines using $match, $lookup, and $group to compute daily revenue.'
      },
      {
        title: 'High-Throughput Sharding & Aggregation Performance Tuning',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Produce an end-to-end database optimization report analyzing slow query profiles, compound index prefix efficiency, shard key cardinality selection, and covered query execution plans.'
      }
    ]
  },

  // 7. Introduction to Data Science
  {
    courseTitle: 'Introduction to Data Science',
    quizzes: [
      {
        title: 'Data Science Foundations & Statistics Quiz',
        difficulty: 'Beginner',
        description: 'Test core data science lifecycle stages, summary statistics, measures of central tendency, and dispersion.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which measure of central tendency is least sensitive to extreme outliers in skewed datasets?',
            options: ['Median', 'Mean', 'Mid-range', 'Root Mean Square'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The median represents the 50th percentile and is robust against extreme values, unlike the arithmetic mean.'
          },
          {
            questionText: 'What does Standard Deviation quantify in descriptive statistics?',
            options: [
              'The average amount of variability or dispersion of data points around the mean',
              'The total number of samples collected',
              'The highest score minus the lowest score',
              'The probability of a type I error'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Standard deviation measures how spread out numbers are from their sample mean.'
          },
          {
            questionText: 'What is the standard interquartile range (IQR) formula used to identify statistical outliers in boxplots?',
            options: ['IQR = Q3 - Q1', 'IQR = Q2 - Q1', 'IQR = (Q1 + Q3) / 2', 'IQR = Q3 + Q1'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'IQR is the difference between the 75th percentile (Q3) and 25th percentile (Q1).'
          },
          {
            questionText: 'What is the primary Python library used for dataframe manipulation and structured data analysis?',
            options: ['pandas', 'scipy', 'django', 'flask'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Pandas provides the DataFrame and Series data structures for data wrangling and tabular analysis.'
          },
          {
            questionText: 'What type of data is represented by categories with a natural order, such as "Low", "Medium", and "High"?',
            options: ['Ordinal Data', 'Nominal Data', 'Continuous Ratio Data', 'Discrete Binary Data'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Ordinal data represents categorical values that have a meaningful, defined ranking or sequence.'
          }
        ]
      },
      {
        title: 'Exploratory Data Analysis, Cleaning & Visualization',
        difficulty: 'Intermediate',
        description: 'Assess techniques in missing data imputation, feature normalization, correlation matrices, and seaborn charts.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the danger of blindly dropping all rows containing missing values (`dropna()`) in a clinical study dataset?',
            options: [
              'Introduces severe selection bias and loses statistical power if missingness is not completely at random (MCAR)',
              'Increases dataset size tenfold',
              'Corrupts the Python virtual environment',
              'Generates negative variance'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Dropping missing values introduces non-random sampling bias and drastically reduces effective sample size.'
          },
          {
            questionText: 'Which correlation coefficient measures monotonic relationships between variables, even if non-linear?',
            options: ['Spearman\'s Rank Correlation', 'Pearson\'s Correlation Coefficient', 'Euclidean Distance', 'Cosine Similarity'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Spearman\'s rank correlation evaluates monotonic relationships using ranks rather than linear raw values.'
          },
          {
            questionText: 'How is Min-Max feature scaling computed for a feature column X?',
            options: [
              '(X - X_min) / (X_max - X_min)',
              '(X - Mean) / StdDev',
              'X / Mean',
              'log(X) * StdDev'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Min-Max normalization bounds values into the [0, 1] range via `(X - min) / (max - min)`.'
          },
          {
            questionText: 'What visual chart in Seaborn/Matplotlib is best suited for examining the distribution shape of a single continuous variable?',
            options: ['Histogram / Kernel Density Estimate (KDE)', 'Pie Chart', 'Scatter plot', 'Heatmap'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Histograms with KDE curves display frequency distributions and modality of continuous variables.'
          },
          {
            questionText: 'What does One-Hot Encoding do to a categorical feature with K categories?',
            options: [
              'Creates K binary columns where each column represents the presence (1) or absence (0) of a category',
              'Replaces category strings with random integers',
              'Sorts the categories alphabetically',
              'Computes the square root of category frequencies'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'One-hot encoding converts categorical variables into binary indicator features suitable for numerical algorithms.'
          },
          {
            questionText: 'What is the purpose of a Heatmap in Exploratory Data Analysis (EDA)?',
            options: [
              'Visualizes pairwise correlation matrices between numerical features using color gradients',
              'Displays server temperature over time',
              'Shows geographical location coordinates',
              'Measures GPU rendering speed'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Heatmaps depict correlation coefficients across feature pairs using intuitive color palettes.'
          },
          {
            questionText: 'In Pandas, which method computes summary statistics (mean, std, min, 25%, 50%, 75%, max) for all numerical columns?',
            options: ['df.describe()', 'df.info()', 'df.summary()', 'df.stats()'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`df.describe()` outputs statistical metrics for all numerical columns in a Pandas DataFrame.'
          }
        ]
      },
      {
        title: 'Hypothesis Testing, Statistical Inference & Experimentation',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering p-values, A/B testing, Type I/II errors, ANOVA, and Central Limit Theorem.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the precise definition of a p-value in null hypothesis significance testing?',
            options: [
              'The probability of observing test results at least as extreme as the observed data, assuming the null hypothesis is true',
              'The probability that the null hypothesis is true',
              'The probability that the alternative hypothesis is false',
              'The error margin of the measurement instrument'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A p-value measures evidence against the null hypothesis: smaller p-values indicate greater incompatibility with H0.'
          },
          {
            questionText: 'What constitutes a Type I Error in statistical hypothesis testing?',
            options: [
              'Rejecting the null hypothesis when it is actually true (False Positive)',
              'Failing to reject the null hypothesis when it is false (False Negative)',
              'Measuring the wrong population group',
              'Arithmetic rounding mistake in calculation'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A Type I error (denoted by alpha α) occurs when researchers incorrectly reject a true null hypothesis.'
          },
          {
            questionText: 'What does the Central Limit Theorem (CLT) state regarding sample means drawn from non-normal populations?',
            options: [
              'The distribution of sample means approaches a normal distribution as sample size N increases (typically N >= 30), regardless of population shape',
              'All data in nature is inherently normally distributed',
              'Sample variance is always equal to population standard deviation',
              'Outliers disappear when sample size reaches 100'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The CLT guarantees that sample averages follow a normal curve for sufficiently large N regardless of underlying distribution.'
          },
          {
            questionText: 'Which statistical test is appropriate for comparing the means of three or more independent groups?',
            options: ['Analysis of Variance (ANOVA)', 'Student\'s Two-Sample t-test', 'Chi-Square Test of Independence', 'Mann-Whitney U Test'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'One-way ANOVA tests whether significant differences exist among the means of three or more independent groups.'
          },
          {
            questionText: 'In online A/B testing experimentation, what is Statistical Power (1 - β)?',
            options: [
              'The probability of correctly rejecting the null hypothesis when a real effect exists (True Positive rate)',
              'The total conversion rate of the variant group',
              'The latency of the web server during the test',
              'The number of users enrolled in the experiment'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Statistical power (typically targeted at 80% or 0.80) is the likelihood of detecting a true effect when one exists.'
          },
          {
            questionText: 'What is Simpson\'s Paradox in data science and statistical analysis?',
            options: [
              'A trend appears in several different groups of data but disappears or reverses when these groups are combined',
              'A dataset with zero variance',
              'A machine learning model with 100% accuracy on training and test data',
              'A plot where all points lie on a straight line'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Simpson\'s Paradox occurs when an unobserved confounding variable reverses relationships between variables in aggregated data.'
          },
          {
            questionText: 'Which non-parametric test is used to compare two independent groups when the assumption of normality is violated?',
            options: ['Mann-Whitney U Test (Wilcoxon Rank-Sum)', 'Paired t-test', 'Pearson Correlation', 'One-way ANOVA'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Mann-Whitney U test evaluates differences between two independent groups without assuming normal distribution.'
          },
          {
            questionText: 'What does the Bonferroni Correction adjust for in statistical research?',
            options: [
              'Controls family-wise error rate when conducting multiple simultaneous hypothesis tests by dividing alpha by the number of comparisons',
              'Fixes sensor calibration drift in hardware',
              'Adjusts for missing values in survey data',
              'Increases the p-value threshold to 0.50'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Bonferroni correction counteracts multiple comparison inflation of false positive rates by tightening the significance threshold.'
          },
          {
            questionText: 'What does a 95% Confidence Interval for a population mean actually mean?',
            options: [
              'If we took repeated random samples, 95% of the calculated intervals would contain the true population mean',
              'There is a 95% probability that the sample mean equals the population mean',
              '95% of individual data values fall within this interval',
              'The experiment has an error rate of exactly 5%'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Frequentist confidence intervals reflect long-run coverage probability across repeated hypothetical sampling experiments.'
          },
          {
            questionText: 'What does the Chi-Square Test of Independence evaluate?',
            options: [
              'Whether a significant association exists between two categorical variables in a contingency table',
              'Whether a continuous variable has zero skewness',
              'The difference between two population variances',
              'The slope of a linear regression line'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Chi-square test assesses whether observed frequencies in a contingency table deviate significantly from expected frequencies.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Data Cleansing and Descriptive Statistics in Python',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Load a messy raw dataset using Pandas, handle missing data using domain-justified strategies, remove duplicate records, and compute descriptive statistics.'
      },
      {
        title: 'Exploratory Data Analysis Report on Real-World Dataset',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Perform an in-depth Exploratory Data Analysis (EDA) on an open government dataset using Pandas and Seaborn, producing visualizations of distributions and correlation heatmaps.'
      },
      {
        title: 'A/B Testing Experiment Design and Statistical Analysis',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Design an end-to-end A/B test for an e-commerce platform including sample size power calculation, hypothesis formulation, t-test / z-test execution, and decision report.'
      }
    ]
  },

  // 8. Machine Learning Basics
  {
    courseTitle: 'Machine Learning Basics',
    quizzes: [
      {
        title: 'Machine Learning Concepts & Evaluation Quiz',
        difficulty: 'Beginner',
        description: 'Test foundational knowledge of supervised vs unsupervised learning, regression vs classification, and training splits.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which machine learning paradigm uses labeled training data containing both input features and ground-truth targets?',
            options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Self-Supervised Clustering'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Supervised learning algorithms train on labeled datasets mapping inputs to known target outputs.'
          },
          {
            questionText: 'What is the primary objective of a Linear Regression model?',
            options: [
              'Predict a continuous numerical target variable by fitting a linear relationship with feature variables',
              'Classify images into categorical labels',
              'Cluster unlabeled customers into marketing personas',
              'Generate photorealistic human faces'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Linear regression models predict quantitative continuous target values.'
          },
          {
            questionText: 'Why is it critical to split data into Training and Test subsets prior to model evaluation?',
            options: [
              'To evaluate how well the trained model generalizes to unseen data and detect overfitting',
              'Because algorithms crash if given all data at once',
              'To reduce file size on disk',
              'To convert numerical data into strings'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Evaluating on held-out test data provides an unbiased estimate of generalization performance on real-world inputs.'
          },
          {
            questionText: 'Which loss function is standard for evaluating continuous regression models?',
            options: ['Mean Squared Error (MSE)', 'Binary Cross-Entropy', 'Categorical Hinge Loss', 'Gini Impurity'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'MSE computes the average squared difference between predicted values and actual ground truth targets.'
          },
          {
            questionText: 'Which unsupervised algorithm partitions data points into K distinct spherical clusters based on centroids?',
            options: ['K-Means Clustering', 'Logistic Regression', 'Support Vector Machine', 'Random Forest'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'K-Means iteratively updates K cluster centroids by minimizing intra-cluster sum-of-squares distance.'
          }
        ]
      },
      {
        title: 'Classification Algorithms, Loss Functions & Metrics',
        difficulty: 'Intermediate',
        description: 'Test classification models, logistic regression, decision trees, ROC-AUC, precision, and recall.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What activation function does Logistic Regression use to map real-valued linear outputs into probabilities between 0 and 1?',
            options: ['Sigmoid (Logistic) Function', 'ReLU (Rectified Linear Unit)', 'Linear Identity', 'Softmax for binary outputs'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The sigmoid function `1 / (1 + e^-z)` squashes continuous inputs into valid probabilities in the [0, 1] range.'
          },
          {
            questionText: 'In a medical cancer detection model where failing to identify a malignant tumor is disastrous, which metric should be maximized?',
            options: ['Recall (Sensitivity)', 'Precision', 'Accuracy', 'Specificity'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'High recall minimizes False Negatives (cases where cancer was present but predicted as negative).'
          },
          {
            questionText: 'What metric represents the harmonic mean of Precision and Recall?',
            options: ['F1-Score', 'ROC-AUC', 'Accuracy', 'Cohen\'s Kappa'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: '`F1 = 2 * (Precision * Recall) / (Precision + Recall)` provides a balanced summary on imbalanced datasets.'
          },
          {
            questionText: 'What problem occurs when a machine learning model scores 99% accuracy on training data but drops to 52% on test data?',
            options: ['Overfitting (High Variance)', 'Underfitting (High Bias)', 'Data Leakage', 'Optimal Convergence'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Overfitting occurs when a model memorizes noise in the training set and fails to generalize to test data.'
          },
          {
            questionText: 'What splitting criterion is used by standard CART decision trees to measure node purity in classification tasks?',
            options: ['Gini Impurity / Information Gain (Entropy)', 'Mean Absolute Error', 'Root Mean Square Error', 'Cosine Distance'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Gini impurity and information gain measure the degree of disorder or mixing of class labels in a tree split.'
          },
          {
            questionText: 'What does the Area Under the ROC Curve (ROC-AUC) measure?',
            options: [
              'The model\'s capability to discriminate between positive and negative classes across all possible decision thresholds',
              'The memory footprint of the model',
              'The training speed in samples per second',
              'The correlation between features'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'ROC-AUC plots True Positive Rate vs False Positive Rate across thresholds; a score of 1.0 represents perfect separation.'
          },
          {
            questionText: 'How does K-Fold Cross-Validation protect against biased train-test splits?',
            options: [
              'Splits data into K folds, training K models using each fold once as a validation set and averaging performance',
              'Multiplies the dataset by K duplicates',
              'Deletes the bottom K% of samples',
              'Trains on GPU cores simultaneously'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'K-fold cross-validation evaluates models across multiple splits, providing a robust estimate of generalization error.'
          }
        ]
      },
      {
        title: 'Ensemble Learning, Regularization & Dimensionality Reduction',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering Random Forests, Gradient Boosting (XGBoost), L1/L2 Regularization, and PCA.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the fundamental difference between Bagging (e.g. Random Forest) and Boosting (e.g. Gradient Boosting)?',
            options: [
              'Bagging trains independent models in parallel and averages predictions (reduces variance); Boosting trains models sequentially to correct prior errors (reduces bias)',
              'Bagging is only for regression; Boosting is only for classification',
              'Boosting uses neural networks while Bagging uses decision trees',
              'There is no mathematical difference'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Bagging reduces variance via parallel bootstrap aggregation. Boosting reduces bias by iteratively fitting residuals.'
          },
          {
            questionText: 'How does L1 Regularization (Lasso) differ from L2 Regularization (Ridge) in linear models?',
            options: [
              'L1 adds the absolute magnitude of coefficients (|w|) driving non-essential weights to exact zero (feature selection); L2 penalizes squared weights (w^2)',
              'L2 drives weights to zero while L1 maintains all weights',
              'L1 is only used in unsupervised learning',
              'L2 can only be used on normalized images'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Lasso (L1) yields sparse weight vectors by zeroing out irrelevant features, while Ridge (L2) shrinks weights continuously.'
          },
          {
            questionText: 'What does Principal Component Analysis (PCA) achieve in high-dimensional feature spaces?',
            options: [
              'Identifies orthogonal axes (eigenvectors) of maximum variance, projecting data onto lower-dimensional coordinates',
              'Randomly deletes half of the columns',
              'Sorts rows by their sum',
              'Replaces missing values with mean predictions'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'PCA performs orthogonal linear transformation to project correlated features into uncorrelated principal components.'
          },
          {
            questionText: 'What is the Bias-Variance Tradeoff in machine learning theory?',
            options: [
              'Simple models suffer from underfitting (high bias); overly complex models suffer from overfitting (high variance); total error is minimized at an intermediate balance',
              'Trading off model accuracy for dollar cost of cloud computing',
              'The difference between training speed and inference speed',
              'The ratio of numerical features to categorical features'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Total expected error equals Bias^2 + Variance + Irreducible Error; tuning model complexity minimizes combined error.'
          },
          {
            questionText: 'What optimization technique updates model weights in the opposite direction of the gradient of the loss function?',
            options: ['Gradient Descent (and variants: Adam, SGD)', 'Grid Search', 'Markov Chain Monte Carlo', 'Breadth-First Search'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Gradient descent computes loss gradients with respect to model parameters to iteratively navigate toward minimum loss.'
          },
          {
            questionText: 'What is Data Leakage in a machine learning predictive pipeline?',
            options: [
              'Information from the target variable or test set is inadvertently included in model training, causing overly optimistic validation metrics that fail in production',
              'A security breach where user passwords are leaked online',
              'A memory leak that crashes the Python kernel',
              'Losing training files during git push'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Data leakage occurs when features contain information not available at actual prediction time, inflating validation scores.'
          },
          {
            questionText: 'In Support Vector Machines (SVM), what is the "Kernel Trick"?',
            options: [
              'Computes dot products in a high-dimensional feature space implicitly without explicitly transforming coordinates, enabling non-linear separation',
              'A method for running SVM on GPU kernels',
              'A way to bypass kernel panics in Linux',
              'A heuristic for deleting outlier data points'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The kernel trick uses kernel functions (RBF, Polynomial) to calculate inner products in higher dimensions efficiently.'
          },
          {
            questionText: 'What is the purpose of Early Stopping in iterative training algorithms like Gradient Boosting or Neural Networks?',
            options: [
              'Halts training when validation loss stops improving for N consecutive epochs, preventing overfitting',
              'Shuts down the server when CPU hits 90%',
              'Stops execution when test accuracy hits 100%',
              'Limits training to exactly 10 minutes'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Early stopping terminates optimization when validation error reaches a minimum, preventing overtraining.'
          },
          {
            questionText: 'What is the difference between Batch Gradient Descent, Mini-batch Gradient Descent, and Stochastic Gradient Descent (SGD)?',
            options: [
              'Batch uses the full dataset per step; Mini-batch uses small subsets (e.g. 32-256 samples); SGD computes gradients on 1 sample per step',
              'Batch is for images; Mini-batch is for audio; SGD is for text',
              'SGD is deterministic while Batch is random',
              'Mini-batch runs on CPU while Batch runs on TPU'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The distinction lies in sample batch size per gradient step, balancing computational stability and convergence speed.'
          },
          {
            questionText: 'What is the purpose of hyperparameter optimization tools like Optuna or Random Search compared to manual tuning?',
            options: [
              'Systematically and efficiently explores complex parameter spaces using Bayesian optimization or sampling to maximize objective metrics',
              'Replaces human engineers completely',
              'Automatically downloads training datasets',
              'Guarantees 100% test accuracy'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Automated search frameworks systematically sample hyperparameter configurations to optimize validation scores.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Train a Linear Regression Model on Housing Data',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Build a Scikit-Learn linear regression pipeline to predict property prices, evaluate MSE and R^2 on test data, and interpret feature coefficients.'
      },
      {
        title: 'Implement a Predictive Classification Pipeline',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Train and evaluate Logistic Regression and Decision Tree classifiers on an imbalanced dataset, evaluating precision, recall, F1, and plotting ROC curves.'
      },
      {
        title: 'End-to-End Ensemble Comparison and Hyperparameter Tuning',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Compare Random Forest and XGBoost classifiers against baseline models, implement K-fold cross-validation, conduct Bayesian hyperparameter optimization, and submit an executive model card.'
      }
    ]
  },

  // 9. Software Engineering Fundamentals
  {
    courseTitle: 'Software Engineering Fundamentals',
    quizzes: [
      {
        title: 'Software Engineering & Architecture Quiz',
        difficulty: 'Beginner',
        description: 'Test foundational knowledge of software development life cycles (SDLC), Waterfall vs Iterative models, and modularity.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which sequential SDLC model completes each phase (Requirements, Design, Implementation, Verification, Maintenance) in strict order before proceeding to the next?',
            options: ['Waterfall Model', 'Extreme Programming (XP)', 'Scrum', 'Kanban'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Waterfall model is a linear sequential process where progress flows steadily downwards through distinct phases.'
          },
          {
            questionText: 'What do High Cohesion and Low Coupling represent in software architectural design?',
            options: [
              'High cohesion means components have closely focused responsibilities; low coupling means components have minimal dependencies on each other',
              'High cohesion means lots of global variables; low coupling means slow network speed',
              'Both refer to database normalization rules only',
              'They describe frontend CSS layout properties'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'High cohesion and low coupling ensure modules are robust, easily testable, and independently maintainable.'
          },
          {
            questionText: 'What is the primary document produced during the software requirement engineering phase describing functional and non-functional specifications?',
            options: ['Software Requirements Specification (SRS)', 'Database Schema Dump', 'Git Commit Log', 'Class Diagram'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The SRS document comprehensively specifies what the software system must do and its operating constraints.'
          },
          {
            questionText: 'What does the V-Model in software engineering highlight regarding verification and validation?',
            options: [
              'Pairs every development phase directly with a corresponding testing phase (e.g. Requirements paired with Acceptance Testing)',
              'Develops code exclusively in the V programming language',
              'Minimizes testing to a single final step',
              'Eliminates the design phase'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The V-model illustrates testing activities corresponding to each stage of software development.'
          },
          {
            questionText: 'What does the \'S\' in SOLID design principles stand for?',
            options: ['Single Responsibility Principle', 'System Optimization Principle', 'Synchronous Execution', 'Security-First Architecture'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Single Responsibility Principle (SRP) states that a class should have only one reason to change.'
          }
        ]
      },
      {
        title: 'Requirement Engineering, UML & Architectural Patterns',
        difficulty: 'Intermediate',
        description: 'Test skills in functional/non-functional requirements, UML diagrams, MVC, Layered architecture, and Microservices.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which of the following is a Non-Functional Requirement (NFR)?',
            options: [
              'The system must authenticate user login within 200 milliseconds under a concurrent load of 5,000 users',
              'The user can click a button to download invoices in PDF',
              'The application allows students to submit quizzes',
              'The system sends an email confirmation after registration'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Performance, security, availability, and scalability are non-functional quality attributes.'
          },
          {
            questionText: 'In the Model-View-Controller (MVC) architectural pattern, what is the role of the Controller?',
            options: [
              'Accepts user inputs from views, converts them into commands, and orchestrates model updates and view rendering',
              'Renders visual HTML elements to the browser',
              'Directly manages SQL database connections',
              'Encrypts network packets over TLS'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Controller handles user requests, interacts with the Model layer, and selects Views for rendering.'
          },
          {
            questionText: 'Which UML diagram models static structure, showing classes, attributes, methods, and relationships like inheritance and aggregation?',
            options: ['Class Diagram', 'Sequence Diagram', 'Activity Diagram', 'Use Case Diagram'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Class diagrams depict the static object-oriented structure of a software system.'
          },
          {
            questionText: 'What architectural style decomposes an application into independent, loosely coupled services communicating via lightweight APIs?',
            options: ['Microservices Architecture', 'Monolithic Architecture', 'Client-Server Batch Processing', 'Peer-to-Peer Tor'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Microservices architecture structures applications as collections of fine-grained, independently deployable services.'
          },
          {
            questionText: 'What is the purpose of a Sequence Diagram in UML dynamic modeling?',
            options: [
              'Visualizes the chronological sequence of message exchanges between objects over time',
              'Shows physical server deployment locations',
              'Maps database tables to disk blocks',
              'Measures line-by-line code coverage'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Sequence diagrams illustrate how objects interact in a chronological order of messages.'
          },
          {
            questionText: 'What design pattern provides a single point of entry for a client to access a complex subsystem of classes?',
            options: ['Facade Pattern', 'Observer Pattern', 'Factory Method', 'Strategy Pattern'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Facade design pattern provides a simplified interface to a complex set of subsystem interfaces.'
          },
          {
            questionText: 'What is Technical Debt in software engineering?',
            options: [
              'The implied cost of future refactoring and rework caused by choosing an easy, suboptimal shortcut now instead of a better approach',
              'The money owed to cloud service providers for computing instances',
              'The salary paid to software developers',
              'The cost of software licensing fees'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Technical debt reflects future maintenance cost accumulated by taking expedient development shortcuts.'
          }
        ]
      },
      {
        title: 'Testing Strategies, CI/CD Pipelines & Clean Code',
        difficulty: 'Advanced',
        description: 'Advanced assessment covering Unit/Integration/E2E testing pyramids, code coverage, CI/CD, and refactoring techniques.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'According to the standard Test Pyramid (Martin Fowler), what should form the broad, foundational base of automated tests?',
            options: [
              'Fast, isolated Unit Tests (high volume)',
              'End-to-End (E2E) Browser Tests',
              'Manual Exploratory Testing',
              'Stress & Chaos Engineering Tests'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The test pyramid recommends a high volume of fast, cheap unit tests at the base, fewer integration tests, and minimal E2E tests at the top.'
          },
          {
            questionText: 'What is the difference between Verification and Validation in software quality assurance?',
            options: [
              'Verification asks "Are we building the product right?" (standards, code reviews); Validation asks "Are we building the right product?" (meeting user needs)',
              'Verification is done by customers; Validation is done by developers',
              'Verification only applies to hardware; Validation applies to software',
              'They are exact synonyms'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Verification checks adherence to specifications, while validation confirms that the software satisfies actual user requirements.'
          },
          {
            questionText: 'What does 100% Statement Code Coverage guarantee regarding software bug freedom?',
            options: [
              'It guarantees every line of code was executed at least once, but DOES NOT guarantee bug freedom or edge case validation',
              'It proves mathematically that the software has zero bugs',
              'It guarantees the system will never crash',
              'It proves the requirements are 100% correct'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'High statement coverage does not prove correctness; it merely verifies that lines were reached during testing.'
          },
          {
            questionText: 'In Test-Driven Development (TDD), what is the cyclic workflow followed by engineers?',
            options: [
              'Red (Write failing test) -> Green (Write minimal code to pass) -> Refactor (Clean up design)',
              'Design -> Implement -> Test -> Ship',
              'Code -> Deploy -> Test in Production -> Hotfix',
              'Write all code -> Write tests months later'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The TDD cycle is Red-Green-Refactor, driving design through executable specifications.'
          },
          {
            questionText: 'What is the role of a Continuous Integration (CI) pipeline in modern DevOps workflows?',
            options: [
              'Automatically builds, lints, and executes the automated test suite upon every git commit/push to detect integration issues immediately',
              'Backs up the codebase to tape drives',
              'Generates marketing documentation for customers',
              'Deploys to production without running tests'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'CI pipelines automate build validation and automated testing upon code merges to prevent broken main branches.'
          },
          {
            questionText: 'What is a "Code Smell" in software engineering and refactoring?',
            options: [
              'A surface symptom in source code that indicates a deeper architectural or structural design weakness (e.g. Long Method, God Class)',
              'A compiler syntax error',
              'A security breach detected by firewalls',
              'An outdated database driver'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Code smells indicate design problems that hinder maintainability, signaling a need for refactoring.'
          },
          {
            questionText: 'What is Boundary Value Analysis (BVA) in black-box test case design?',
            options: [
              'Testing inputs at the extreme boundaries and just outside boundaries of equivalence partitions (e.g. min, min-1, max, max+1)',
              'Testing only the middle values of input ranges',
              'Testing random inputs generated by a neural network',
              'Testing network boundary firewalls'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'BVA concentrates test cases at input parameter edges where defects are statistically most likely to occur.'
          },
          {
            questionText: 'What is Regression Testing in software maintenance?',
            options: [
              'Re-running existing test suites after code changes to ensure new modifications haven\'t inadvertently broken previously working functionality',
              'Reverting all code back to version 1.0',
              'Testing legacy software on obsolete operating systems',
              'Deleting all automated tests'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Regression testing verifies that bug fixes and feature enhancements do not introduce unexpected regressions.'
          },
          {
            questionText: 'What does the Open/Closed Principle (OCP) in SOLID design dictate?',
            options: [
              'Software entities (classes, modules) should be open for extension, but closed for modification',
              'All source code must be open source on GitHub',
              'Database connections should be opened and closed immediately',
              'APIs must be accessible without authentication'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'OCP encourages designs where new functionality is added by writing new code rather than mutating existing tested code.'
          },
          {
            questionText: 'What is the purpose of Static Code Analysis tools (such as SonarQube or ESLint)?',
            options: [
              'Analyzes source code without executing it to detect security vulnerabilities, anti-patterns, style violations, and bugs',
              'Runs code on virtual machines to measure execution speed',
              'Compresses JavaScript files into smaller sizes',
              'Translates English comments into foreign languages'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Static analysis inspects code structure against rules and patterns to catch bugs and vulnerabilities prior to execution.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Compare SDLC Models & Justify Project Selection',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Prepare an academic report comparing Waterfall, Agile Scrum, Spiral, and V-Model across risk, requirement stability, and delivery cadence with a real-world case study.'
      },
      {
        title: 'Author a Software Requirements Specification (SRS) Document',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Draft a comprehensive IEEE 830-compliant SRS document for a hospital patient management system detailing functional requirements, non-functional constraints, and use cases.'
      },
      {
        title: 'Comprehensive Software Test Plan and Bug Tracking Matrix',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Develop a master test plan containing unit, integration, and system test cases using Equivalence Partitioning and Boundary Value Analysis, along with a severity/priority defect tracking matrix.'
      }
    ]
  },

  // 10. Agile Software Development
  {
    courseTitle: 'Agile Software Development',
    quizzes: [
      {
        title: 'Agile & Scrum Framework Mastery Quiz',
        difficulty: 'Beginner',
        description: 'Test foundational understanding of the Agile Manifesto values, Scrum ceremonies, and user stories.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'Which of the following is one of the four foundational core values of the Agile Manifesto?',
            options: [
              'Responding to change over following a plan',
              'Comprehensive documentation over working software',
              'Contract negotiation over customer collaboration',
              'Processes and tools over individuals and interactions'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Agile Manifesto values "Responding to change over following a plan".'
          },
          {
            questionText: 'In the Scrum framework, which role is solely accountable for maximizing the value of the product and managing the Product Backlog?',
            options: ['Product Owner', 'Scrum Master', 'Development Team Lead', 'Project Sponsor'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Product Owner is responsible for product vision, backlog prioritization, and ROI.'
          },
          {
            questionText: 'What is the timeboxed duration of a Daily Scrum (Standup) meeting?',
            options: ['15 minutes', '30 minutes', '45 minutes', '60 minutes'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Daily Scrum is timeboxed to 15 minutes to inspect progress toward the Sprint Goal.'
          },
          {
            questionText: 'What acronym summarizes the quality criteria of well-formed User Stories?',
            options: ['INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable)', 'SMART', 'SOLID', 'ACID'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The INVEST mnemonic guide defines effective user stories.'
          },
          {
            questionText: 'What ceremony occurs at the end of every sprint dedicated to team reflection and continuous process improvement?',
            options: ['Sprint Retrospective', 'Sprint Review', 'Sprint Planning', 'Backlog Refinement'],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Sprint Retrospective is held for the Scrum team to inspect itself and plan improvements.'
          }
        ]
      },
      {
        title: 'Scrum Roles, Artifacts & Sprint Ceremonies',
        difficulty: 'Intermediate',
        description: 'Test deep understanding of Sprint Planning, Sprint Goal, Definition of Done, and Velocity.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the Definition of Done (DoD) in Scrum?',
            options: [
              'A formal shared checklist of quality criteria that an increment must satisfy to be considered releasable',
              'The time when a developer finishes typing code',
              'The date when a client signs the contract',
              'When all unit tests are deleted'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Definition of Done creates shared transparency that work meets quality standards required for product release.'
          },
          {
            questionText: 'What happens to incomplete Product Backlog items when a Sprint ends?',
            options: [
              'They are re-estimated, returned to the Product Backlog, and reprioritized by the Product Owner for future sprints',
              'They are marked as done anyway',
              'They are permanently deleted from Jira',
              'The sprint duration is extended until they are finished'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Incomplete items are not counted in velocity; they return to the product backlog for reprioritization.'
          },
          {
            questionText: 'What is the role of the Scrum Master regarding impediments faced by developers?',
            options: [
              'Acts as a servant-leader, actively helping to remove organizational roadblocks that block team progress',
              'Assigns tasks to developers each morning',
              'Writes all automated unit tests',
              'Fires developers who fail to meet deadlines'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Scrum Master serves the team by removing impediments and facilitating Agile practices.'
          },
          {
            questionText: 'What is Team Velocity in Agile project management?',
            options: [
              'The amount of story points completed and accepted by the team in a typical sprint',
              'The typing speed of developers',
              'The network download bandwidth of the office',
              'The number of bugs found by QA'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Velocity measures the rate at which a Scrum team delivers accepted backlog items per sprint.'
          },
          {
            questionText: 'What is the primary output of the Sprint Planning meeting?',
            options: [
              'The Sprint Goal and the Sprint Backlog (selected backlog items + delivery plan)',
              'A signed legal contract with penalties',
              'A 100-page architectural specification',
              'The complete release of the entire product'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Sprint Planning results in a agreed-upon Sprint Goal and the concrete Sprint Backlog.'
          },
          {
            questionText: 'How should Story Points be estimated during Planning Poker?',
            options: [
              'Based on relative effort, complexity, and uncertainty, rather than absolute hours of calendar time',
              'Strictly 1 point equals 1 developer hour',
              'Decided solely by the Product Owner without developer input',
              'Calculated from lines of code'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Story points represent relative effort and risk estimated collectively by the people doing the work.'
          },
          {
            questionText: 'In a Sprint Review meeting, who is invited to inspect the product increment?',
            options: [
              'The Scrum Team and key stakeholders invited by the Product Owner',
              'Only the developers',
              'Only the external jury',
              'Only competitors'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'The Sprint Review is an interactive demo where the Scrum team and stakeholders review what was accomplished.'
          }
        ]
      },
      {
        title: 'Requirement Changes, Backlog Reprioritization & Agile Governance',
        difficulty: 'Advanced',
        description: 'Advanced assessment on handling mid-sprint requirement changes, backlog grooming, Burn-down charts, and Scaled Agile.',
        passingPercentage: 60,
        questions: [
          {
            questionText: 'What is the recommended Agile procedure when a stakeholder introduces an urgent new requirement (e.g. CR-001) during an active sprint?',
            options: [
              'The Product Owner reviews the requirement, assesses business value, adds it to the Product Backlog, and prioritizes it for the NEXT sprint planning rather than disrupting active sprint commitments',
              'Developers immediately stop active work and build the new requirement without informing the Product Owner',
              'The Scrum Master immediately cancels the sprint and restarts a new 3-month project',
              'Reject the requirement permanently because Agile forbids requirement changes'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Agile welcomes changing requirements, but protects active sprint focus by grooming and prioritizing changes into upcoming sprints.'
          },
          {
            questionText: 'Under what extreme circumstance can an active Sprint be cancelled before its timebox expires?',
            options: [
              'Only by the Product Owner if the Sprint Goal becomes completely obsolete (e.g. market change or company liquidation)',
              'If one developer gets sick',
              'If the weather is bad',
              'If unit tests take longer than 5 minutes to run'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A sprint can be prematurely cancelled only by the Product Owner when the underlying Sprint Goal no longer makes business sense.'
          },
          {
            questionText: 'What does a Sprint Burndown Chart display on its axes?',
            options: [
              'Remaining estimated work (Story Points or hours) on the vertical axis against elapsed sprint days on the horizontal axis',
              'Server memory usage over time',
              'Number of coffee cups consumed',
              'Customer satisfaction rating over 10 years'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'A burndown chart tracks remaining work day-by-day, providing visual feedback on progress toward sprint completion.'
          },
          {
            questionText: 'What is Backlog Refinement (Grooming) and what percentage of team capacity is typically allocated to it?',
            options: [
              'The ongoing activity of detailing, splitting, and re-estimating backlog items, typically consuming ~5-10% of team capacity',
              'An annual audit of source code comments',
              'A meeting to assign blame for missed deadlines',
              'Cleaning physical whiteboards with disinfectant'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Refinement prepares upcoming stories for smooth planning and takes about 5-10% of team time.'
          },
          {
            questionText: 'How does the Scaled Agile Framework (SAFe) coordinate multiple Scrum teams working on a unified enterprise product?',
            options: [
              'Aligns teams into Agile Release Trains (ARTs) synchronized on common Program Increments (PI) with cadence-based planning',
              'Merges all teams into a single 500-person daily standup',
              'Replaces Agile with strict Waterfall management',
              'Assigns one manager to dictate all code'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'SAFe organizes teams into Agile Release Trains (ARTs) that plan, commit, and execute synchronized 8-12 week increments.'
          },
          {
            questionText: 'What is an "Information Radiator" in Agile workspace design?',
            options: [
              'A prominent, publicly visible display (such as a Kanban board or burndown monitor) displaying real-time team progress to anyone walking by',
              'A heating element that warms the computer lab',
              'A microwave antenna on the roof',
              'An internal encrypted database'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'An information radiator displays status openly so everyone understands project progress without asking.'
          },
          {
            questionText: 'What is the difference between a "Spike" and a regular User Story in Agile?',
            options: [
              'A Spike is a timeboxed research or prototyping task used to answer an unknown technical question or mitigate architectural risk',
              'A Spike is a bug in production',
              'A Spike is a story that was rejected by QA',
              'There is no difference'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Spikes are research or proof-of-concept tasks designed to gather knowledge and reduce uncertainty.'
          },
          {
            questionText: 'What is the primary risk of "Scope Creep" and how does Agile prevent it?',
            options: [
              'Uncontrolled expansion of project scope without adjustments to time, cost, and resources; mitigated by fixed-length timeboxed sprints and explicit backlog trade-offs',
              'Code getting too small to read',
              'Running out of disk space on laptops',
              'Hiring too many junior engineers'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Timeboxed sprints and Product Owner backlog trade-offs ensure that new items require removing or deferring lower-priority items.'
          },
          {
            questionText: 'What is a Cumulative Flow Diagram (CFD) used for in Kanban and Agile tracking?',
            options: [
              'Visualizes work-in-progress (WIP), lead times, and bottlenecks across workflow stages over time',
              'Plots developer blood pressure during code review',
              'Measures lines of code committed to git',
              'Calculates cloud server electricity usage'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'CFDs illustrate queue sizes and lead times across stages, quickly surfacing process bottlenecks.'
          },
          {
            questionText: 'Why does Agile discourage assigning tasks to individuals during Sprint Planning, preferring team self-organization?',
            options: [
              'Promotes collective ownership, swarming on bottlenecks, higher collaboration, and shared responsibility for the Sprint Goal',
              'Because managers do not know how to code',
              'To avoid paying bonuses to top performers',
              'Because Scrum masters are lazy'
            ],
            correctOptionIndex: 0,
            marks: 2,
            explanation: 'Collective ownership encourages team members to pull tasks dynamically and swarm on priorities to achieve the Sprint Goal.'
          }
        ]
      }
    ],
    assignments: [
      {
        title: 'Write INVEST User Stories and Acceptance Criteria',
        difficulty: 'Beginner',
        maxMarks: 20,
        dueDateDays: 7,
        description: 'Draft 5 complete user stories following standard persona template ("As a... I want to... So that...") with Given-When-Then Gherkin acceptance criteria.'
      },
      {
        title: 'Build a Product Backlog & Sprint Plan for an Agile Project',
        difficulty: 'Intermediate',
        maxMarks: 30,
        dueDateDays: 14,
        description: 'Construct a prioritized 15-item Product Backlog with Story Points (Fibonacci), simulate team velocity (30 pts/sprint), and craft a Sprint 1 plan with defined Sprint Goal.'
      },
      {
        title: 'Agile Requirement Change Management Case Study (CR-001)',
        difficulty: 'Advanced',
        maxMarks: 50,
        dueDateDays: 21,
        description: 'Document an end-to-end Change Request (CR-001: Discussion Forum) scenario: analyze business justification, demonstrate backlog reprioritization, and craft the Sprint 2 delivery plan.'
      }
    ]
  }
];

module.exports = assessmentsPart2;
