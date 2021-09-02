## UIA Examples

### Asset Create
```
  golos.broadcast.assetCreate(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '1000.000 SUPER', true, true, "{\"image_url\":\"https://market.rudex.org/asset-symbols/rudex.golos.png\",\"description\":\"https://golos.id/\"}",
    [], function(err, result) {
  console.log(err, result);
});
```
### Asset Update
```
  golos.broadcast.assetUpdate(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'SUPER', ['GOLOS'], 10000, "{\"image_url\":\"https://market.rudex.org/asset-symbols/rudex.golos.png\",\"description\":\"http://golos.id/\"}",
    [], function(err, result) {
  console.log(err, result);
});
```
### Asset Issue
```
  golos.broadcast.assetIssue(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', '1000.000 SUPER', '',
    [], function(err, result) {
  console.log(err, result);
});
```
### Override Transfer
```
  golos.broadcast.overrideTransfer(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'test', 'test2', '1.000 SUPER', 'Hello world!',
    [], function(err, result) {
  console.log(err, result);
});
```
### Asset Transfer
```
  golos.broadcast.assetTransfer(
    '5JVFFWRLwz6JoP9kguuRFfytToGU6cLgBVTL9t6NB3D3BQLbUBS',
    'cyberfounder', 'SUPER', 'test',
    [], function(err, result) {
  console.log(err, result);
});
```
