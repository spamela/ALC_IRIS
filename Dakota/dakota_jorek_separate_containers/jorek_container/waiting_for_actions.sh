# --- Container lifetime (minutes)
n_lifetime=1000
echo "---------------------------------" > waiting_for_actions.txt
echo "Container waiting for actions..." >> waiting_for_actions.txt
echo "Total waiting time before exit: $n_lifetime" >> waiting_for_actions.txt
echo "---------------------------------" >> waiting_for_actions.txt

# --- Wait for action
for (( i = 0; i <= $n_lifetime; i++ ))
do
  echo "waiting for actions" >> waiting_for_actions.txt
  echo "  time: $i minutes out of $n_lifetime" >> waiting_for_actions.txt
  sleep 60
done
