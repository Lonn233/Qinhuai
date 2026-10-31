// Original slender, bent-top box lanterns beside Tianxia Wenshu and along its road.
// Audited against the source GLB nodes: 26 complete lamps, eight components each.
// Explicit names keep nearby architecture and other streetlamp styles intact.
const REMOVED_LAMP_NODES = new Set([
  // tile-09.glb / FuziTemple1457
  "FuziTemple1457", "FuziTemple1458", "FuziTemple1459", "FuziTemple1460", "FuziTemple1461", "FuziTemple1462", "FuziTemple1463", "FuziTemple1464",
  // tile-09.glb / FuziTemple1520
  "FuziTemple1520", "FuziTemple1521", "FuziTemple1522", "FuziTemple1523", "FuziTemple1524", "FuziTemple1525", "FuziTemple1526", "FuziTemple1527",
  // tile-09.glb / FuziTemple1529
  "FuziTemple1529", "FuziTemple1530", "FuziTemple1531", "FuziTemple1532", "FuziTemple1533", "FuziTemple1534", "FuziTemple1535", "FuziTemple1536",
  // tile-09.glb / FuziTemple1538
  "FuziTemple1538", "FuziTemple1539", "FuziTemple1540", "FuziTemple1541", "FuziTemple1542", "FuziTemple1543", "FuziTemple1544", "FuziTemple1545",
  // tile-09.glb / FuziTemple1549
  "FuziTemple1547", "FuziTemple1548", "FuziTemple1549", "FuziTemple1550", "FuziTemple1551", "FuziTemple1552", "FuziTemple1553", "FuziTemple1554",
  // tile-09.glb / FuziTemple1562
  "FuziTemple1556", "FuziTemple1557", "FuziTemple1558", "FuziTemple1559", "FuziTemple1560", "FuziTemple1561", "FuziTemple1562", "FuziTemple1563",
  // tile-09.glb / FuziTemple1567
  "FuziTemple1565", "FuziTemple1566", "FuziTemple1567", "FuziTemple1568", "FuziTemple1569", "FuziTemple1570", "FuziTemple1571", "FuziTemple1572",
  // tile-09.glb / FuziTemple1580
  "FuziTemple1574", "FuziTemple1575", "FuziTemple1576", "FuziTemple1577", "FuziTemple1578", "FuziTemple1579", "FuziTemple1580", "FuziTemple1581",
  // tile-09.glb / FuziTemple1585
  "FuziTemple1583", "FuziTemple1584", "FuziTemple1585", "FuziTemple1586", "FuziTemple1587", "FuziTemple1588", "FuziTemple1589", "FuziTemple1590",
  // tile-09.glb / FuziTemple1598
  "FuziTemple1592", "FuziTemple1593", "FuziTemple1594", "FuziTemple1595", "FuziTemple1596", "FuziTemple1597", "FuziTemple1598", "FuziTemple1599",
  // tile-09.glb / FuziTemple1603
  "FuziTemple1601", "FuziTemple1602", "FuziTemple1603", "FuziTemple1604", "FuziTemple1605", "FuziTemple1606", "FuziTemple1607", "FuziTemple1608",
  // tile-09.glb / FuziTemple1616
  "FuziTemple1610", "FuziTemple1611", "FuziTemple1612", "FuziTemple1613", "FuziTemple1614", "FuziTemple1615", "FuziTemple1616", "FuziTemple1617",
  // tile-09.glb / FuziTemple1621
  "FuziTemple1619", "FuziTemple1620", "FuziTemple1621", "FuziTemple1622", "FuziTemple1623", "FuziTemple1624", "FuziTemple1625", "FuziTemple1626",
  // tile-09.glb / FuziTemple1630
  "FuziTemple1628", "FuziTemple1629", "FuziTemple1630", "FuziTemple1631", "FuziTemple1632", "FuziTemple1633", "FuziTemple1634", "FuziTemple1635",
  // tile-09.glb / FuziTemple1639
  "FuziTemple1637", "FuziTemple1638", "FuziTemple1639", "FuziTemple1640", "FuziTemple1641", "FuziTemple1642", "FuziTemple1643", "FuziTemple1644",
  // tile-09.glb / FuziTemple1648
  "FuziTemple1646", "FuziTemple1647", "FuziTemple1648", "FuziTemple1649", "FuziTemple1650", "FuziTemple1651", "FuziTemple1652", "FuziTemple1653",
  // tile-09.glb / FuziTemple1657
  "FuziTemple1655", "FuziTemple1656", "FuziTemple1657", "FuziTemple1658", "FuziTemple1659", "FuziTemple1660", "FuziTemple1661", "FuziTemple1662",
  // tile-09.glb / FuziTemple1664
  "FuziTemple1664", "FuziTemple1665", "FuziTemple1666", "FuziTemple1667", "FuziTemple1668", "FuziTemple1669", "FuziTemple1670", "FuziTemple1671",
  // tile-09.glb / FuziTemple1675
  "FuziTemple1673", "FuziTemple1674", "FuziTemple1675", "FuziTemple1676", "FuziTemple1677", "FuziTemple1678", "FuziTemple1679", "FuziTemple1680",
  // tile-09.glb / FuziTemple1682
  "FuziTemple1682", "FuziTemple1683", "FuziTemple1684", "FuziTemple1685", "FuziTemple1686", "FuziTemple1687", "FuziTemple1688", "FuziTemple1689",
  // tile-10.glb / FuziTemple1473
  "FuziTemple1466", "FuziTemple1467", "FuziTemple1468", "FuziTemple1469", "FuziTemple1470", "FuziTemple1471", "FuziTemple1472", "FuziTemple1473",
  // tile-10.glb / FuziTemple1476
  "FuziTemple1475", "FuziTemple1476", "FuziTemple1477", "FuziTemple1478", "FuziTemple1479", "FuziTemple1480", "FuziTemple1481", "FuziTemple1482",
  // tile-10.glb / FuziTemple1486
  "FuziTemple1484", "FuziTemple1485", "FuziTemple1486", "FuziTemple1487", "FuziTemple1488", "FuziTemple1489", "FuziTemple1490", "FuziTemple1491",
  // tile-10.glb / FuziTemple1500
  "FuziTemple1493", "FuziTemple1494", "FuziTemple1495", "FuziTemple1496", "FuziTemple1497", "FuziTemple1498", "FuziTemple1499", "FuziTemple1500",
  // tile-10.glb / FuziTemple1504
  "FuziTemple1502", "FuziTemple1503", "FuziTemple1504", "FuziTemple1505", "FuziTemple1506", "FuziTemple1507", "FuziTemple1508", "FuziTemple1509",
  // tile-10.glb / FuziTemple1518
  "FuziTemple1511", "FuziTemple1512", "FuziTemple1513", "FuziTemple1514", "FuziTemple1515", "FuziTemple1516", "FuziTemple1517", "FuziTemple1518",
]);

export function removeOriginalGateStreetlamps(root) {
  const removed = [];
  root.traverse(object => { if (REMOVED_LAMP_NODES.has(object.name)) removed.push(object); });
  // Detach before collision, lighting, reflections and visibility registration.
  // Shared GLB materials/geometries may still belong to retained meshes.
  for (const object of removed) object.removeFromParent();
  root.userData.removedOriginalStreetlamps = removed.map(object => object.name);
  return removed.length;
}
