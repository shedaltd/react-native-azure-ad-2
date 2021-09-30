# REACT-NATIVE-AZURE-AD2 Example

This is an example created to demonstrate a basic integration of `REACT-NATIVE-AZURE-AD2`

To start you first have to install dependencies

```bash
  yarn install
```

## iOS

To run on iOS you will need to run

```bash
    yarn ios
```

and follow the instruction in your terminal

## Issues

if you get an error similar to the one below

``` bash
Invariant Violation: requireNativeComponent: "RNCSafeAreaProvider" was not found in the UIManager 
```

run

```bash
    npx pod-install ios
```

You might have clear the data in your simulator i.e. `Devices > Erase All Content and Settings` and try again.