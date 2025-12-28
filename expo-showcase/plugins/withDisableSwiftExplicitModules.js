const { withXcodeProject, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Config plugin to disable Swift explicit modules for Xcode 26 compatibility.
 *
 * Xcode 26 enables Swift explicit modules by default, which can cause
 * compilation errors with some React Native libraries (e.g., react-native-gesture-handler).
 *
 * This plugin:
 * 1. Sets SWIFT_ENABLE_EXPLICIT_MODULES to NO in the main Xcode project build settings
 * 2. Adds a post_install hook to the Podfile to disable it for all Pod targets
 *
 * @see https://reactnative.dev/blog/2025/08/12/react-native-0.81
 */
const withDisableSwiftExplicitModules = (config) => {
  // First, modify the main Xcode project build settings
  config = withXcodeProject(config, async (config) => {
    const xcodeProject = config.modResults;

    // Get all build configurations and set the build setting
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();

    for (const key in configurations) {
      if (typeof configurations[key] === 'object' && configurations[key].buildSettings) {
        configurations[key].buildSettings.SWIFT_ENABLE_EXPLICIT_MODULES = 'NO';
      }
    }

    return config;
  });

  // Second, modify the Podfile to add post_install hook for Pod targets
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      if (fs.existsSync(podfilePath)) {
        let podfileContent = fs.readFileSync(podfilePath, 'utf8');

        // Check if our post_install hook is already added
        if (!podfileContent.includes('SWIFT_ENABLE_EXPLICIT_MODULES')) {
          // Find the existing post_install block or add a new one
          const postInstallHook = `
  # Disable Swift explicit modules for Xcode 26 compatibility
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'
    end
  end`;

          // Check if there's already a post_install block
          const postInstallRegex = /post_install\s+do\s+\|installer\|/;
          if (postInstallRegex.test(podfileContent)) {
            // Insert our code right after the post_install do |installer| line
            podfileContent = podfileContent.replace(
              postInstallRegex,
              `post_install do |installer|${postInstallHook}`
            );
          } else {
            // Add a new post_install block at the end
            podfileContent += `

post_install do |installer|${postInstallHook}
end
`;
          }

          fs.writeFileSync(podfilePath, podfileContent);
        }
      }

      return config;
    },
  ]);

  return config;
};

module.exports = withDisableSwiftExplicitModules;
