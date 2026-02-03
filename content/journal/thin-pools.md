+++
title = "[OS Dev] LVM and Thin Pools"
date = 2026-02-01
+++

### Key components of LVM

*Physical volume*: A partition or whole disk designated for LVM.

*Volume group*: A collection of PVs which creates a pool of disk space from which you can allocate logical volumes.

*Logical volume*: A usable storage device


### Why use LVM?

* Flexible capacity: aggregate devices into a single LV; file systems exist over multiple disks.
* Device naming: add custom names
* Resizable storage volumes: can extend/reduce LVs with software commands instead of reformatting and repartitoining the underlying device
* Online data realocation: move data while system is active with `pmove` (e.g. hot-swappable disks)
* Striped volumes: stripe data across 2+ devices for greater throughput
* RAID volumes: protect against device failure and improve performance with RAID'
* Volume snapshots: take snapshots for backups without affecting real data
* Thin volumes: LVs that are larger than physical space
* Caching: cache data from LVs to boost performance

*Note*: For optimal performance, the whole disk should be paritioned as a single PV for LVM use

### How to create an LVM PV

1. `lsblk # this will list all of the available storage devices`
2. `pvcreate /dev/sdb # replace /dev/sdb with the storage device to be initialized as a PV`
3. `pvs` to display the created physical volume`
4. `pvremove` to remove a volume

### How to create a LVM VG

1. Create VG: `vgcreate vg1 /dev/vdb1`
2. Extend VG: `vgextend vg1 /dev/vdb2`
3. Combine VG: `vgmerge vg1 vg2`
4. Remove PV from VG `pvmove # to migrate the data` and then `vgreduce vg1 /dev/vdb3 # remove the /dev/vdb3 PV from vg1`
5. Split VG: `vgsplit`
6. Move VG to another system: `vgimport` and `vgexport`
7. Remove VG: `vgremove`

### LV Management

1. Concatenation
This is a thick/linear logical volume
```
lvcreate --name lv1 --size 100M vg1 # creates a linear logical volume with vg1 volume group
```
2. Striping
```
lvcreate --stripes 2 --stripesize 100M --size 200M --name lv1 vg1

# to show the type
lvs -o lv_name,seg_type
```

3. RAID
```
lvcreate --type raid0 --stripes 2 --stripesize 100M --size 200M --name lv1 vg1
```
4. Thin Provisioning
There are a couple of caveats here:
* bad DISCARD handling can cause full allocation of d
* CoW can be slower on fs with snapshot
* data blocks can be mixed between multiple fs, which leads to random access limitations
```
lvcreate --type thin-pool --size 100M --name tp1 vg1
# then you can create a thin LV inside the thin pool
lvcreate --type thin --virtualsize 100M --name tv1 --thinpool tp1 vg1
lvcreate --type thin --virtualsize 60M --name tv2 --thinpool tp1 vg1
```
5. Snapshots
There are both **thick** and **thin** snapshots.
* Thick Snapshots require you allocate storage upfront which can be extended or reduced; it only keeps track of changes. You allocate based on expected rate of change, never over 100% of the original LV.
* Thin snapshots are created from an existing thin provisioned LV, which doesn't require allocating space upfront. It allocates disk on an as-needed basis, which lets you create a bunch of LVs without up-front allocation.

What kind of snapshot you use fully depends on whether the volume itself is thick or thin.
```
# create a snapshot
lvcreate --snapshot --size 100M --name thick_snapshot vg1/lv1

# auto-extend thick logical volume snapshots
# edit /etc/lvm/lvm.conf
# change:
snapshot_autoextend_threshold = 70
snapshot_autoextend_percent = 20

systemctl restart lvm2-monitor

# create a thin snapshot
lvcreate --snapshot --name thin_snapshot vg1/lv1 # where lv1 is a thin volume
```
6. Caching
You can both cache an uncache LVs for faster reads.

A cache pool stores:
* actual cached content
* cache metadata

Then you associate the pool with an actual LV to cache the LV's data. For `dm-cache`, the hot blocks will move to the cache, the cold blocks stay on the slow device

Using a `dm-writecache` is a caching layer between the LV and the physical storage; it writes to something like an SSD before writing to the primary storage.

```
# create a cache pool
lvcreate --type cache-pool --name cp1 --size 100M vg1 /dev/vdb2 # where /dev/vdb2 is the path to the fast device

lvconvert --type cache --cachepool vg1/cp1 vg1/lv1 # attach the cache pool to the LV # this is a read cache cache pool

# create a write cache
lvcreate --name cv1 --size 100M vg1 /dev/vdb2

# attach tot he lv
lvconvert --type writecache --cachevol cv1 vg1/lv1
```

