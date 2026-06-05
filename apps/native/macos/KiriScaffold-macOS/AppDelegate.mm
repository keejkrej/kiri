#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"KiriScaffold";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  self.dependencyProvider = [RCTAppDependencyProvider new];

  dispatch_async(dispatch_get_main_queue(), ^{
    for (NSWindow *window in NSApp.windows) {
      [window setContentSize:NSMakeSize(1280, 800)];
      [window setMinSize:NSMakeSize(960, 600)];
    }
  });

  return [super applicationDidFinishLaunching:notification];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  NSString *metroPort =
      [[[NSProcessInfo processInfo] environment] objectForKey:@"RCT_METRO_PORT"] ?: @"8081";
  NSString *packagerHost =
      [NSString stringWithFormat:@"localhost:%@", metroPort];

  // Bypass RCTBundleURLProvider packager probing, which can return nil on macOS
  // even when Metro is running.
  return [RCTBundleURLProvider jsBundleURLForBundleRoot:@"index"
                                         packagerHost:packagerHost
                                       packagerScheme:@"http"
                                            enableDev:YES
                                   enableMinification:NO
                                      inlineSourceMap:NO
                                          modulesOnly:NO
                                            runModule:YES];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
  return true;
#else
  return false;
#endif
}

@end
