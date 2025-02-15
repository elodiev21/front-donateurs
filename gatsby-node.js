const path = require('path');

exports.createPages = async ({ actions: { createPage }, graphql, reporter }) => {
  const result = await graphql(`
    {
      allFile(filter: {sourceInstanceName: {eq: "markdown-pages"}}) {
        nodes {
          childMarkdownRemark {
            id
          }
          name
          relativeDirectory
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query.');
    return;
  }

  result.data.allFile.nodes.forEach(({
    childMarkdownRemark,
    name,
    relativeDirectory,
  }) => {
    if (!childMarkdownRemark) {
      return;
    }

    createPage({
      path: path.join(relativeDirectory, name),
      component: require.resolve('./src/templates/SimplePage.js'),
      context: { id: childMarkdownRemark.id },
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /tripetto.*/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
