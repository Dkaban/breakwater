// Start Breakwater once the deferred scripts have loaded.
$('units').onclick=()=>{imperial=!imperial;localStorage.setItem('breakwaterUnits',imperial?'imperial':'metric');buttons();render()};
buttons();
select(spot);
