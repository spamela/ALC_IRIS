# --- Container lifetime (minutes) infinite if 0
n_lifetime=0
echo "---------------------------------" > waiting_for_actions.txt
echo "Container waiting for actions..." >> waiting_for_actions.txt
echo "Total waiting time before exit: $n_lifetime" >> waiting_for_actions.txt
echo "---------------------------------" >> waiting_for_actions.txt

# --- Wait for action
if [$n_lifetime -gt 0]
then
  for (( i = 0; i <= $n_lifetime; i++ ))
  do
    echo "waiting for actions" >> waiting_for_actions.txt
    echo "  time: $i minutes out of $n_lifetime" >> waiting_for_actions.txt
    sleep 60
  done
else
  i=0
  while true
  do
    echo "waiting for actions" >> waiting_for_actions.txt
    echo "  time alive: $i minutes" >> waiting_for_actions.txt
    sleep 60
    i=$((i+1))
  done
fi
