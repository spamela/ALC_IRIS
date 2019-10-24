#!/usr/bin/env python
import numpy
import pylab
from mpl_toolkits.mplot3d import Axes3D
import matplotlib
from matplotlib import cm
from matplotlib import pyplot as plt
def main():
 
        # --- Open data file
        filename = "jorek_multidim.dat"
        my_file = open(filename,"r")
        lines=my_file.readlines()
        x1 = []
        x2 = []
        ff = []
        for line in (lines):
          array_tmp = line.split()
          if (array_tmp[1] == "interface"):
            continue
          x1.append(float(array_tmp[2]))
          x2.append(float(array_tmp[3]))
          ff.append(float(array_tmp[4]))
        
        nn = (len(x1))**0.5
        X1 = numpy.reshape(x1, (nn, nn))
        X2 = numpy.reshape(x2, (nn, nn))
        FF = numpy.reshape(ff, (nn, nn))
        
        fig = plt.figure()
        ax = plt.axes(projection='3d')
        ax.contour3D(X1, X2, FF, 200, cmap='binary')
        #ax.plot_surface(X1, X2, FF, rstride=20, cstride=1, cmap=cm.jet, linewidth=0.01)
        plt.show()
        



main()
