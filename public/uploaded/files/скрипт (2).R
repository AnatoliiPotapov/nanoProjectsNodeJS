library(ggplot2)

x1 <- c(0, 190, 362, 541, 599)
y1 <- c(579, 536, 512, 475, 469)

x2 <- c(0, 133, 281, 395, 515, 626)
y2 <- c(517, 483, 461, 451, 440, 437)

factor <- c(1,1,1,1,1,2,2,2,2,2,2)

df1 <- data.frame(x = c(x1), y = c(y1), type=c("с циллиндром","с циллиндром","с циллиндром","с циллиндром","с циллиндром"))
df2 <- data.frame(x = c(x2), y = c(y2), type=c("без циллиндра","без циллиндра","без циллиндра","без циллиндра","без циллиндра","без циллиндра"))


spline_data1 <- data.frame(
  with(df1,
       spline(x,y, xout = seq(0, 600, by = 10))),
  type = "с циллиндром"
)

spline_data2 <- data.frame(
  with(df2,
       spline(x,y, xout = seq(0, 600, by = 10))),
  type = "без циллиндра"
)

ggplot(rbind(spline_data1,spline_data2), aes(x,y,group=type,colour=type)) +
  geom_line() +
  geom_point(data = rbind(df1,df2)) +
  xlab("Время") +
  ylab("Rho")
